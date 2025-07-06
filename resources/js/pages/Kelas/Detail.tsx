import HeadingSmall from '@/components/heading-small';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@inertiajs/core';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Siswa {
    id: number;
    // nama: string;
    user: {
        name: string;
    } | null;
    nisn: string;
}

interface Props extends PageProps {
    kelasItem: {
        id: number;
        nama: string;
        teachers?: {
            id: string;
            nama: string;
        } | null;
    };
    siswas: Siswa[];
}

interface SiswaOption {
    id: number;
    // nama: string;
    user: {
        name: string;
    };
}

export default function KelasDetail() {
    const { kelasItem, siswas = [], allSiswas = [] } = usePage<Props & { allSiswas: SiswaOption[] }>().props;

    const { data, setData, post, processing, reset, errors } = useForm({
        siswa_id: '',
    });

    const handleAssign = (e: FormEvent) => {
        e.preventDefault();

        if (data.siswa_id === '') {
            return;
        }

        post(`/kelas/${kelasItem.id}/assign-siswa`, {
            preserveScroll: true,
            onSuccess: () => {
                reset('siswa_id');
            },
            onError: (errors) => {
                console.error('Error assigning siswa:', errors);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Kelas', href: '/kelas' },
                { title: kelasItem.nama, href: `#` },
            ]}
        >
            <Head title={`Detail ${kelasItem.nama}`} />
            <div className="space-y-6 p-6">
                <HeadingSmall title="Kelas" />
                <h1 className="text-xl font-semibold">{kelasItem.nama}</h1>
                {/* <p className="text-muted-foreground">Homeroom Teacher: {kelasItem.teacher?.name ?? '-'}</p> */}
                {/* <p className="text-muted-foreground">
                    Teacher List: {kelasItem.teachers && kelasItem.teachers.length > 0 ? kelasItem.teachers.map((t) => t.name).join(', ') : '-'}
                </p> */}

                <form onSubmit={handleAssign} className="mt-6 flex items-center gap-2">
                    <select
                        value={data.siswa_id ?? ''}
                        onChange={(e) => setData('siswa_id', e.target.value)}
                        className="rounded border px-3 py-2"
                        disabled={processing}
                    >
                        <option value="">-- Select Siswa --</option>
                        {allSiswas.filter(Boolean).map((siswa) => (
                            <option key={siswa.id} value={siswa.id.toString()}>
                                {/* {siswa.nama} */}
                                {siswa.user?.name ?? '-'}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        disabled={processing || data.siswa_id === ''}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing ? 'Adding...' : 'Add'}
                    </button>
                </form>

                {errors.siswa_id && <p className="text-sm text-red-500">{errors.siswa_id}</p>}

                <div>
                    <h2 className="mt-6 mb-2 text-lg font-medium">Registered Siswas</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>NISN</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {siswas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-muted-foreground text-center italic">
                                        No siswas registered in this class.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                siswas.map((siswa, i) => (
                                    <TableRow key={siswa.id}>
                                        <TableCell>{i + 1}</TableCell>
                                        {/* <TableCell>{siswa.nama}</TableCell> */}
                                        <TableCell>{siswa.user?.name ?? '-'}</TableCell>
                                        <TableCell>{siswa.nisn}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
