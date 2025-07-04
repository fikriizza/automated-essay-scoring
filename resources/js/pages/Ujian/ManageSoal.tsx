import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Soal {
    id: string;
    pertanyaan: string;
}

interface Ujian {
    id: string;
    nama_ujian: string;
    kelas: {
        nama_kelas: string;
    };
    mata_pelajaran: {
        nama_mapel: string;
    };
    soals: Soal[];
}

interface PageProps {
    ujian: Ujian;
    flash?: {
        message?: string;
    };
}

export default function ManageSoal() {
    const { ujian, flash } = usePage().props as PageProps;
    const { data, setData, post, processing, reset, errors } = useForm({ pertanyaan: '' });
    const [editing, setEditing] = useState<Soal | null>(null);
    const { delete: destroy } = useForm();
    const [soalList, setSoalList] = useState<Soal[]>(ujian.soal);
    const handleSubmit = () => {
        if (editing) {
            post(
                route('ujian.update_soal', {
                    ujian_id: ujian.id,
                    soal_id: editing.id,
                }),
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset();
                        setEditing(null);
                    },
                },
            );
        } else {
            post(route('ujian.store_soal', ujian.id), {
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (soal: Soal) => {
        setEditing(soal);
        setData('pertanyaan', soal.pertanyaan);
    };
    const handleDelete = (soalId: string) => {
        if (confirm('Yakin ingin menghapus soal ini?')) {
            destroy(route('ujian.destroy_soal', { ujian_id: ujian.id, soal_id: soalId }), {
                preserveScroll: true,
                only: ['ujian'],
                onSuccess: () => {
                    reset();
                    // setEditing(null);
                },
            });
        }
    };
    //   const handleDelete = (soalId: string) => {
    //     if (confirm('Yakin ingin menghapus soal ini?')) {
    //       router.delete(route('ujian.destroy_soal', { ujian_id: ujian.id, soal_id: soalId }), {
    //         preserveScroll: true,
    //       });
    //     }
    //   };
    // const handleDelete = (soalId: string) => {
    //     if (confirm('Yakin ingin menghapus soal ini?')) {
    //         destroy(route('ujian.destroy_soal', { ujian_id: ujian.id, soal_id: soalId }), {
    //             preserveScroll: true,
    //         });
    //     }
    // };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Ujian', href: '/ujian' },
                { title: 'Kelola Soal', href: '#' },
            ]}
        >
            <Head title="Kelola Soal" />
            <div className="container mx-auto max-w-3xl space-y-6 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Ujian</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p>
                            <strong>Nama Ujian:</strong> {ujian.nama_ujian}
                        </p>
                        <p>
                            <strong>Kelas:</strong> {ujian.kelas.nama_kelas}
                        </p>
                        <p>
                            <strong>Mata Pelajaran:</strong> {ujian.mata_pelajaran.nama_mapel}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{editing ? 'Edit Soal' : 'Tambah Soal Baru'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Label htmlFor="pertanyaan">Pertanyaan</Label>
                            <Input
                                id="pertanyaan"
                                value={data.pertanyaan}
                                onChange={(e) => setData('pertanyaan', e.target.value)}
                                placeholder="Tulis pertanyaan soal di sini"
                            />
                            {errors.pertanyaan && <p className="text-sm text-red-500">{errors.pertanyaan}</p>}
                            <div className="flex justify-end gap-2">
                                {editing && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            reset();
                                            setEditing(null);
                                        }}
                                    >
                                        Batal
                                    </Button>
                                )}
                                <Button onClick={handleSubmit} disabled={processing}>
                                    {processing ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Tambah Soal'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Soal ({ujian.soals.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {ujian.soals.length === 0 ? (
                            <p className="text-muted-foreground italic">Belum ada soal ditambahkan.</p>
                        ) : (
                            ujian.soals.map((soal, index) => (
                                <div key={soal.id} className="flex items-start justify-between rounded-md border p-3 transition hover:shadow-sm">
                                    <div className="flex-1 text-sm">
                                        <p className="font-medium">Soal #{index + 1}</p>
                                        <p className="text-muted-foreground mt-1">{soal.pertanyaan}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(soal)}>
                                            <Edit className="mr-1 h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(soal.id)}>
                                            <Trash2 className="mr-1 h-4 w-4" />
                                            Hapus
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
