<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;


use Illuminate\Database\Eloquent\Model;

class Cv extends Model
{
    protected $fillable = [
        'user_id', 'title', 'personal_info', 'summary', 'skills',
        'experience', 'education', 'projects', 'source',
        'original_file_path', 'parsed_text',
    ];

    protected $casts = [
        'personal_info' => 'array',
        'skills' => 'array',
        'experience' => 'array',
        'education' => 'array',
        'projects' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function analyses()
    {
        return $this->hasMany(CvAnalysis::class);
    }

    public function toAnalysisText(): string
    {
        if ($this->parsed_text) {
            return $this->parsed_text;
        }

        $parts = [
            $this->summary,
            'Skills: ' . implode(', ', $this->skills ?? []),
        ];

        foreach ($this->experience ?? [] as $exp) {
            $parts[] = ($exp['role'] ?? '') . ' at ' . ($exp['company'] ?? '') . ': ' . ($exp['description'] ?? '');
        }

        foreach ($this->education ?? [] as $edu) {
            $parts[] = ($edu['degree'] ?? '') . ' - ' . ($edu['school'] ?? '');
        }

        return implode("\n", array_filter($parts));
    }
}