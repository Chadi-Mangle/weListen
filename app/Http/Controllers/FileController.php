<?php

use Illuminate\Http\Request;
use App\Models\File;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|max:2048'
        ]);

        if ($request->file('file')) {
            $file = $request->file('file');
            $path = $file->store('uploads', 'public');

            $savedFile = File::create([
                'name' => $file->getClientOriginalName(),
                'path' => $path
            ]);

            return response()->json([
                'message' => 'Save with success',
                'file' => $savedFile
            ], 201);
        }

        return response()->json(['error' => 'Error during upload'], 400);
    }

    public function download(File $file)
    {
        return Storage::download('public/' . $file->path);
    }
}
