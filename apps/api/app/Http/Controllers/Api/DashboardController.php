<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Cv;
use App\Models\Job;
use App\Services\AiService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private AiService $ai)
    {
    }

    // GET /api/dashboard
    public function index(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;

        $latestCv = Cv::where('user_id', $userId)->orderByDesc('updated_at')->first();

        $profileCompleteness = $this->calculateCompleteness($user, $latestCv);
        $recommendedJobs = $this->getRecommendedJobs($user, $latestCv);
        $jobMatchesCount = $recommendedJobs->count();

        $newThisWeek = $recommendedJobs->filter(function ($job) {
            $jobModel = Job::find($job['id']);
            return $jobModel && $jobModel->posted_at && $jobModel->posted_at->gte(now()->subDays(7));
        })->count();

        $activeApplicationsCount = Application::where('user_id', $userId)
            ->whereIn('status', ['applied', 'interview'])
            ->count();

        $interviewsScheduledCount = Application::where('user_id', $userId)
            ->where('status', 'interview')
            ->count();

        // Tips dynamically based on profile completeness & CV existence
        $tips = [];
        if (empty($user->target_roles)) {
            $tips[] = 'Atur Peran Impian di profil untuk presisi rekomendasi lowongan';
        }
        if (! $latestCv) {
            $tips[] = 'Unggah atau buat CV di menu CV & ATS Score untuk menghitung Match Score AI';
        } else {
            $tips[] = 'Jalankan Analisis ATS Score AI terhadap lowongan impian kamu';
        }
        $tips[] = 'Update status lamaran di Tracker setelah kamu melamar';

        return response()->json([
            'greeting_name' => $user->name,
            'target_roles' => $user->target_roles ?? [],
            'profile_completeness' => $profileCompleteness,
            'job_matches_count' => $jobMatchesCount,
            'job_matches_new_this_week' => $newThisWeek,
            'active_applications_count' => $activeApplicationsCount,
            'interviews_scheduled_count' => $interviewsScheduledCount,
            'recommended_jobs' => $recommendedJobs->values(),
            'tips' => $tips,
        ]);
    }

    private function calculateCompleteness($user, ?Cv $cv): int
    {
        $checks = [
            ! empty($user->name),
            ! empty($user->email),
            ! empty($user->target_roles) && is_array($user->target_roles) && count($user->target_roles) > 0,
        ];

        if ($cv) {
            $cvText = $cv->toAnalysisText();
            $checks[] = ! empty(trim($cvText));
            $checks[] = ! empty($cv->skills) || str_contains(strtolower($cvText), 'skill');
            $checks[] = ! empty($cv->experience) || str_contains(strtolower($cvText), 'pengalaman') || str_contains(strtolower($cvText), 'experience');
            $checks[] = ! empty($cv->education) || str_contains(strtolower($cvText), 'pendidikan') || str_contains(strtolower($cvText), 'education');
        } else {
            $checks[] = false;
            $checks[] = false;
            $checks[] = false;
            $checks[] = false;
        }

        $filled = collect($checks)->filter(fn ($item) => $item === true)->count();
        return (int) round(($filled / count($checks)) * 100);
    }

    private function getRecommendedJobs($user, ?Cv $cv)
    {
        $jobs = Job::orderByDesc('posted_at')->get();

        // 1. If user has a CV with text, match using AI or keyword fallback on CV text
        if ($cv && ! empty(trim($cv->toAnalysisText()))) {
            $cvText = $cv->toAnalysisText();
            $jobsPayload = $jobs->map(fn ($job) => [
                'id' => $job->id,
                'title' => $job->title,
                'company' => $job->company,
                'required_skills' => $job->required_skills,
            ])->all();

            try {
                $scores = $this->ai->matchCvToJobs($cvText, $jobsPayload);
                $scoreMap = collect($scores)->keyBy('job_id');

                $recommended = $jobs->map(function ($job) use ($scoreMap) {
                    $score = (int) ($scoreMap[$job->id]['match_score'] ?? 0);
                    return [
                        'id' => $job->id,
                        'title' => $job->title,
                        'company' => $job->company,
                        'location' => $job->location,
                        'match_score' => $score,
                    ];
                })
                ->filter(fn ($j) => $j['match_score'] > 0)
                ->sortByDesc('match_score')
                ->take(5);

                if ($recommended->isNotEmpty()) {
                    return $recommended;
                }
            } catch (\Throwable $e) {
                $fallback = $this->getRecommendedJobsKeywordFallback($cv, $jobs);
                if ($fallback->isNotEmpty()) {
                    return $fallback;
                }
            }
        }

        // 2. Fallback: If no CV or no CV matches, recommend jobs matching user's target_roles from profile
        $targetRoles = is_array($user->target_roles) ? $user->target_roles : [];
        if (! empty($targetRoles)) {
            return $jobs->sortByDesc(function ($job) use ($targetRoles) {
                $score = 0;
                $titleLower = strtolower($job->title);
                $descLower = strtolower($job->description);
                foreach ($targetRoles as $role) {
                    $roleLower = strtolower(trim($role));
                    if (empty($roleLower)) {
                        continue;
                    }
                    if (str_contains($titleLower, $roleLower)) {
                        $score += 50;
                    }
                    $terms = array_filter(explode(' ', str_replace(['/', '-'], ' ', $roleLower)));
                    foreach ($terms as $t) {
                        if (strlen($t) > 2 && str_contains($titleLower, $t)) {
                            $score += 15;
                        }
                        if (strlen($t) > 2 && str_contains($descLower, $t)) {
                            $score += 5;
                        }
                    }
                }
                return $score;
            })->take(5)->map(fn ($job) => [
                'id' => $job->id,
                'title' => $job->title,
                'company' => $job->company,
                'location' => $job->location,
                'match_score' => 0,
            ]);
        }

        return $jobs->take(5)->map(fn ($job) => [
            'id' => $job->id,
            'title' => $job->title,
            'company' => $job->company,
            'location' => $job->location,
            'match_score' => 0,
        ]);
    }

    private function getRecommendedJobsKeywordFallback(Cv $cv, $jobs)
    {
        $cvTextLower = strtolower($cv->toAnalysisText());

        return $jobs->map(function ($job) use ($cvTextLower) {
            $jobSkills = collect($job->required_skills ?? [])->map(fn ($s) => strtolower(trim($s)))->filter()->unique();
            if ($jobSkills->isEmpty()) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company' => $job->company,
                    'location' => $job->location,
                    'match_score' => 0,
                ];
            }

            $matchedCount = 0;
            foreach ($jobSkills as $skill) {
                if (str_contains($cvTextLower, $skill)) {
                    $matchedCount++;
                }
            }

            $score = (int) round(($matchedCount / $jobSkills->count()) * 100);

            return [
                'id' => $job->id,
                'title' => $job->title,
                'company' => $job->company,
                'location' => $job->location,
                'match_score' => $score,
            ];
        })
        ->filter(fn ($j) => $j['match_score'] > 0)
        ->sortByDesc('match_score')
        ->take(5);
    }
}