<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApplicationController extends Controller
{
    // GET /api/applications
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $applications = Application::where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get();

        if ($applications->isEmpty()) {
            $defaultApplications = [
                [
                    'user_id' => $userId,
                    'company' => 'Tokopedia',
                    'position' => 'Junior UI/UX Designer',
                    'applied_date' => '2026-07-12',
                    'deadline' => '2026-07-28',
                    'type' => 'Full-time',
                    'contact' => 'Diana R.',
                    'location' => 'Jakarta',
                    'status' => 'interview',
                ],
                [
                    'user_id' => $userId,
                    'company' => 'Ruangguru',
                    'position' => 'Product Designer',
                    'applied_date' => '2026-07-10',
                    'deadline' => '2026-07-25',
                    'type' => 'Full-time',
                    'contact' => null,
                    'location' => 'Remote',
                    'status' => 'applied',
                ],
                [
                    'user_id' => $userId,
                    'company' => 'Kata.ai',
                    'position' => 'UX Researcher Intern',
                    'applied_date' => '2026-07-08',
                    'deadline' => '2026-07-30',
                    'type' => 'Internship',
                    'contact' => 'Fajar H.',
                    'location' => 'Bandung',
                    'status' => 'offer',
                ],
                [
                    'user_id' => $userId,
                    'company' => 'Dana',
                    'position' => 'UI Designer',
                    'applied_date' => '2026-07-01',
                    'deadline' => '2026-07-15',
                    'type' => 'Contract',
                    'contact' => null,
                    'location' => 'Jakarta',
                    'status' => 'rejected',
                ],
                [
                    'user_id' => $userId,
                    'company' => 'Gojek',
                    'position' => 'Design System Intern',
                    'applied_date' => '2026-06-18',
                    'deadline' => null,
                    'type' => 'Internship',
                    'contact' => null,
                    'location' => 'Remote',
                    'status' => 'no_reply',
                ],
                [
                    'user_id' => $userId,
                    'company' => 'Bibit',
                    'position' => 'Junior Product Designer',
                    'applied_date' => null,
                    'deadline' => '2026-08-05',
                    'type' => 'Full-time',
                    'contact' => null,
                    'location' => 'Jakarta',
                    'status' => 'not_started',
                ],
            ];

            foreach ($defaultApplications as $appData) {
                Application::create($appData);
            }

            $applications = Application::where('user_id', $userId)
                ->orderByDesc('created_at')
                ->get();
        }

        return response()->json($applications);
    }

    // POST /api/applications
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'job_id' => 'nullable|exists:job_listings,id',
            'company' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'applied_date' => 'nullable|date',
            'deadline' => 'nullable|date',
            'type' => 'nullable|string',
            'contact' => 'nullable|string',
            'location' => 'nullable|string',
            'status' => 'nullable|in:not_started,applied,interview,offer,rejected,no_reply',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $application = Application::create([
            'user_id' => $request->user()->id,
            'job_id' => $request->job_id,
            'company' => $request->company,
            'position' => $request->position,
            'applied_date' => $request->applied_date,
            'deadline' => $request->deadline,
            'type' => $request->type,
            'contact' => $request->contact,
            'location' => $request->location,
            'status' => $request->status ?? 'not_started',
        ]);

        return response()->json($application, 201);
    }

    // PATCH /api/applications/{id}
    public function update(Request $request, $id)
    {
        $application = Application::where('user_id', $request->user()->id)->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'company' => 'sometimes|string|max:255',
            'position' => 'sometimes|string|max:255',
            'applied_date' => 'nullable|date',
            'deadline' => 'nullable|date',
            'type' => 'nullable|string',
            'contact' => 'nullable|string',
            'location' => 'nullable|string',
            'status' => 'sometimes|in:not_started,applied,interview,offer,rejected,no_reply',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $application->update($request->only([
            'company', 'position', 'applied_date', 'deadline',
            'type', 'contact', 'location', 'status',
        ]));

        return response()->json($application);
    }

    // DELETE /api/applications/{id}
    public function destroy(Request $request, $id)
    {
        $application = Application::where('user_id', $request->user()->id)->findOrFail($id);
        $application->delete();

        return response()->json(['message' => 'deleted']);
    }
}