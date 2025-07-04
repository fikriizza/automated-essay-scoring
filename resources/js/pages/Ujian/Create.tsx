import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, BookOpen, FileText } from 'lucide-react';

interface Kelas {
    id: string;
    nama_kelas: string;
}

interface MataPelajaran {
    id: string;
    nama_mapel: string;
}

interface PageProps {
    kelas: Kelas[];
    mataPelajarans: MataPelajaran[];
}

const breadcrumbs = [
    { title: 'Ujian', href: '/ujian' },
    { title: 'Tambah Ujian', href: '/ujian/create' },
];

export default function Create({ kelas, mataPelajarans }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        nama_ujian: '',
        kelas_id: '',
        mata_pelajaran_id: '',
    });

    const handleSubmit = () => {
        post(route('ujian.store'));
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Ujian" />
            <div className="container mx-auto max-w-4xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <FileText className="text-primary h-6 w-6" />
                            <h1 className="text-3xl font-bold tracking-tight">Tambah Ujian Baru</h1>
                        </div>
                        <p className="text-muted-foreground">Buat ujian berdasarkan kelas dan mata pelajaran.</p>
                    </div>
                    <Link href="/ujian">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                <Separator className="mb-6" />

                {hasErrors && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Terdapat kesalahan pada form. Silakan periksa kembali data yang dimasukkan.</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Informasi Ujian
                        </CardTitle>
                        <CardDescription>Lengkapi informasi ujian</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_ujian">
                                        Nama Ujian <span className="text-red-500">*</span>
                                    </Label>
                                    <input
                                        id="nama_ujian"
                                        type="text"
                                        value={data.nama_ujian}
                                        onChange={(e) => setData('nama_ujian', e.target.value)}
                                        className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none ${
                                            errors.nama_ujian ? 'border-red-500 focus:ring-red-500' : 'focus:ring-primary border-gray-300'
                                        }`}
                                        placeholder="Contoh: Ujian IPA Kelas 6 Semester Ganjil"
                                    />
                                    {errors.nama_ujian && <p className="text-xs text-red-500">{errors.nama_ujian}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kelas_id">
                                        Kelas <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={data.kelas_id} onValueChange={(value) => setData('kelas_id', value)}>
                                        <SelectTrigger className={errors.kelas_id ? 'border-red-500 focus:ring-red-500' : ''}>
                                            <SelectValue placeholder="Pilih kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kelas.map((kls) => (
                                                <SelectItem key={kls.id} value={kls.id}>
                                                    {kls.nama_kelas}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kelas_id && <p className="text-xs text-red-500">{errors.kelas_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mata_pelajaran_id">
                                        Mata Pelajaran <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={data.mata_pelajaran_id} onValueChange={(value) => setData('mata_pelajaran_id', value)}>
                                        <SelectTrigger className={errors.mata_pelajaran_id ? 'border-red-500 focus:ring-red-500' : ''}>
                                            <SelectValue placeholder="Pilih mata pelajaran" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mataPelajarans.map((mapel) => (
                                                <SelectItem key={mapel.id} value={mapel.id}>
                                                    {mapel.nama_mapel}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.mata_pelajaran_id && <p className="text-xs text-red-500">{errors.mata_pelajaran_id}</p>}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end space-x-2">
                                <Link href="/ujian">
                                    <Button variant="outline" disabled={processing}>
                                        Batal
                                    </Button>
                                </Link>
                                <Button onClick={handleSubmit} disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Ujian'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mt-6 border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="rounded-full bg-blue-100 p-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-blue-900">Informasi</h4>
                                <p className="text-sm text-blue-700">
                                    Setelah membuat ujian, Anda dapat menambahkan soal ke dalam ujian ini melalui halaman "Kelola Soal".
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
