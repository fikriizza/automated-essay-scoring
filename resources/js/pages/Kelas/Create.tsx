import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, UserPlus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kelas', href: '/kelas' },
    { title: 'Add Kelas', href: '/kelas/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_kelas: '',
        tahun_ajaran: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('kelas.store'), {
            forceFormData: true,
        });
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Siswa" />
            <div className="container mx-auto max-w-4xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <UserPlus className="text-primary h-6 w-6" />
                            <h1 className="text-3xl font-bold tracking-tight">Add New Kelas</h1>
                        </div>
                        <p className="text-muted-foreground">Enter kelas data into the system</p>
                    </div>
                    <Link href="/kelas">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                </div>

                <Separator className="mb-6" />

                {hasErrors && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>There is an error in the form. Please double check the data entered.</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Kelas Information
                        </CardTitle>
                        <CardDescription>Complete kelas information for academic data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_kelas">
                                        Nama Kelas <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nama_kelas"
                                        value={data.nama_kelas}
                                        onChange={(e) => setData('nama_kelas', e.target.value)}
                                        placeholder="Contoh: Budi Santoso"
                                        className={errors.nama_kelas ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errors.nama_kelas && <p className="text-xs text-red-500">{errors.nama_kelas}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tahun_ajaran">
                                        Tahun Ajaran <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="tahun_ajaran"
                                        value={data.tahun_ajaran}
                                        onChange={(e) => setData('tahun_ajaran', e.target.value)}
                                        placeholder="Contoh: 2020/2021"
                                        className={errors.tahun_ajaran ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errors.tahun_ajaran && <p className="text-xs text-red-500">{errors.tahun_ajaran}</p>}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Save Kelas
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
