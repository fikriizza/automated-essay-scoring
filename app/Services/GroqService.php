<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GroqService
{
    // public static function nilaiJawaban(array $soalsJawaban): array
    // {
    //     $prompt = "Saya akan memberikan soal dan jawaban dari siswa. Tolong nilai jawaban siswa dari 0 sampai 100 berdasarkan relevansi, kelengkapan, dan ketepatan. Skor harus berupa angka bulat (integer).\n\nBalas dalam format JSON seperti ini:\n{\n  \"penilaian\": [\n    { \"soal_id\": \"uuid-soal\", \"skor\": 80 }\n  ]\n}\n\nBerikut adalah data soal dan jawaban:\n\n";

    //     foreach ($soalsJawaban as $index => $item) {
    //         $prompt .= ($index + 1) . ". Soal ID: {$item['soal_id']}\n";
    //         $prompt .= "Soal: {$item['soal']}\n";
    //         $prompt .= "Jawaban: {$item['jawaban']}\n\n";
    //     }

    //     $response = Http::withToken(config('services.groq.key'))
    //         ->post(config('services.groq.url'), [
    //             'model' => config('services.groq.model'),
    //             'temperature' => 0.2,
    //             'max_completion_tokens' => 512,
    //             'response_format' => ['type' => 'json_object'],
    //             'messages' => [
    //                 [
    //                     'role' => 'user',
    //                     'content' => $prompt
    //                 ]
    //             ],
    //         ]);

    //     return $response->json('penilaian') ?? [];
    // }
    // public static function nilaiJawaban(array $data): array
    // {
    //     $prompt = "Saya akan memberikan soal dan jawaban dari siswa. Tolong nilai jawaban siswa dari 0 sampai 100 berdasarkan relevansi, kelengkapan, dan ketepatan.\n\n";
    //     $prompt .= "Balas dalam format JSON seperti ini:\n";
    //     $prompt .= "{\n  \"penilaian\": [\n    {\"soal_id\": \"uuid-soal-1\", \"skor\": 80},\n    {\"soal_id\": \"uuid-soal-2\", \"skor\": 100}\n  ]\n}\n\n";
    //     $prompt .= "Berikut adalah data soal dan jawaban:\n\n";

    //     foreach ($data as $i => $item) {
    //         $prompt .= ($i + 1) . ". Soal ID: {$item['soal_id']}\n";
    //         $prompt .= "Soal: {$item['soal']}\n";
    //         $prompt .= "Jawaban: {$item['jawaban']}\n\n";
    //     }

    //     $payload = [
    //         'messages' => [
    //             [
    //                 'role' => 'user',
    //                 'content' => $prompt,
    //             ],
    //         ],
    //         'model' => config('services.groq.model'),
    //         'temperature' => 1,
    //         'max_completion_tokens' => 1024,
    //         'top_p' => 1,
    //         'stream' => false,
    //         'response_format' => [
    //             'type' => 'json_object',
    //         ],
    //         'stop' => null,
    //     ];

    //     // Tambahkan ini untuk cek JSON yang akan dikirim ke Groq
    //     // dd([
    //     //     'url' => config('services.groq.url'),
    //     //     'headers' => [
    //     //         'Authorization' => 'Bearer ' . config('services.groq.key'),
    //     //         'Content-Type' => 'application/json',
    //     //     ],
    //     //     'payload' => $payload,
    //     // ]);

    //     $response = Http::withHeaders([
    //         'Authorization' => 'Bearer ' . config('services.groq.key'),
    //         'Content-Type' => 'application/json',
    //     ])->post(config('services.groq.url'), $payload);
    //     // dd($response->json());
    //     return $response->json('penilaian');
    // }
    public static function nilaiJawaban(array $data): array
    {
        $prompt = "Saya akan memberikan soal dan jawaban dari siswa. Tolong nilai jawaban siswa dari 0 sampai 100 berdasarkan relevansi, kelengkapan, dan ketepatan.\n\n";
        $prompt .= "Balas dalam format JSON seperti ini:\n";
        $prompt .= "{\n  \"penilaian\": [\n    {\"soal_id\": \"uuid-soal-1\", \"skor\": 80},\n    {\"soal_id\": \"uuid-soal-2\", \"skor\": 100}\n  ]\n}\n\n";
        $prompt .= "Berikut adalah data soal dan jawaban:\n\n";

        foreach ($data as $i => $item) {
            $prompt .= ($i + 1) . ". Soal ID: {$item['soal_id']}\n";
            $prompt .= "Soal: {$item['soal']}\n";
            $prompt .= "Jawaban: {$item['jawaban']}\n\n";
        }

        $payload = [
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $prompt,
                ],
            ],
            'model' => config('services.groq.model'),
            'temperature' => 1,
            'max_completion_tokens' => 1024,
            'top_p' => 1,
            'stream' => false,
            'response_format' => [
                'type' => 'json_object',
            ],
            'stop' => null,
        ];

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.groq.key'),
            'Content-Type' => 'application/json',
        ])->post(config('services.groq.url'), $payload);

        $json = $response->json();
        // ✅ Jika Groq langsung membalas array (seperti di log kamu)
        if (array_is_list($json) && isset($json[0]['soal_id'])) {
            return $json;
        }

        // ✅ Jika format response adalah OpenAI-style
        if (isset($json['choices'][0]['message']['content'])) {
            $content = $json['choices'][0]['message']['content'];
            $parsed = json_decode($content, true);
            if (isset($parsed['penilaian'])) {
                return $parsed['penilaian'];
            }
        }

        throw new \Exception('Respons dari Groq tidak sesuai format yang diharapkan.');
        // cek apakah message ada
        // if (!isset($json['choices'][0]['message']['content'])) {
        //     throw new \Exception('Response Groq tidak sesuai format.');
        // }

        // $content = $json['choices'][0]['message']['content'];

        // $parsed = json_decode($content, true);

        // if (!isset($parsed['penilaian'])) {
        //     throw new \Exception('Field penilaian tidak ditemukan di dalam konten.');
        // }

        // return $parsed['penilaian'] ?? $parsed ?? [];
    }
}
