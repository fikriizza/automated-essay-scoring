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
    { title: 'MataPelajaran', href: '/mata_pelajaran' },
    { title: 'Add MataPelajaran', href: '/mata_pelajaran/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_mapel: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('mata_pelajaran.store'), {
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
                            <h1 className="text-3xl font-bold tracking-tight">Add New MataPelajaran</h1>
                        </div>
                        <p className="text-muted-foreground">Enter student data into the system</p>
                    </div>
                    <Link href="/mata_pelajaran">
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
                            MataPelajaran Information
                        </CardTitle>
                        <CardDescription>Complete student information for academic data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_mapel">
                                        Mata Pelajaran <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nama_mapel"
                                        value={data.nama_mapel}
                                        onChange={(e) => setData('nama_mapel', e.target.value)}
                                        placeholder="Contoh: IPA"
                                        className={errors.nama_mapel ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errors.nama_mapel && <p className="text-xs text-red-500">{errors.nama_mapel}</p>}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Save MataPelajaran
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
