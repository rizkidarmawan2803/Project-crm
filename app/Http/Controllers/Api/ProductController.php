<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index()
    {
        try {
            $products = Product::orderBy('nama_product', 'asc')->get();
            return response()->json([
                'status' => 'success',
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data produk.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_product' => 'required|string|max:100|unique:products,nama_product',
            'deskripsi' => 'nullable|string',
        ], [
            'nama_product.required' => 'Nama produk wajib diisi.',
            'nama_product.max' => 'Nama produk maksimal 100 karakter.',
            'nama_product.unique' => 'Nama produk sudah terdaftar.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $product = new Product();
            $product->nama_product = $request->nama_product;
            $product->deskripsi = $request->deskripsi;
            $product->created_at = now();
            $product->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Produk berhasil ditambahkan.',
                'data' => $product
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menyimpan produk.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $product = Product::findOrFail($id);

            $product->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Produk berhasil dihapus.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus produk.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
