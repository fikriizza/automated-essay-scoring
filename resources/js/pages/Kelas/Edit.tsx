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
    { title: 'Student', href: '/siswa' },
    { title: 'Edit Student', href: '/#' },
];
interface EditProps {
    siswa: {
        id: number;
        nama: string;
        nisn: string | null;
    };
}

export default function Edit({ siswa }: EditProps) {
    const { data, setData, post, processing, errors } = useForm({
        nama: siswa.nama || '',
        nisn: siswa.nisn || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('siswa.update', siswa.id), {
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
                            <h1 className="text-3xl font-bold tracking-tight">Add New Student</h1>
                        </div>
                        <p className="text-muted-foreground">Enter student data into the system</p>
                    </div>
                    <Link href="/siswa">
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
                            Student Information
                        </CardTitle>
                        <CardDescription>Complete student information for academic data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama">
                                        Full Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        placeholder="Contoh: Budi Santoso"
                                        className={errors.nama ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errors.nama && <p className="text-xs text-red-500">{errors.nama}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nisn">
                                        NISN <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nisn"
                                        value={data.nisn}
                                        onChange={(e) => setData('nisn', e.target.value)}
                                        placeholder="Contoh: 123456789"
                                        className={errors.nisn ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errors.nisn && <p className="text-xs text-red-500">{errors.nisn}</p>}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Save Student
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
