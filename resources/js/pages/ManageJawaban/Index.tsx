import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import { useState } from 'react';

interface Ujian {
    id: string;
    nama_ujian: string;
    mata_pelajaran: {
        nama_mapel: string;
    };
    kelas: {
        nama_kelas: string;
        tahun_ajaran: string;
    };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedUjians {
    data: Ujian[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface PageProps {
    ujians: PaginatedUjians;
    filters: {
        search: string;
        per_page: number;
        sort_by?: string;
        sort_direction?: 'asc' | 'desc';
    };
}

export default function Index() {
    const { ujians, filters } = usePage().props as PageProps;
    const [search, setSearch] = useState(filters.search ?? '');
    const [perPage, setPerPage] = useState(filters.per_page ?? 10);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('manage.jawaban.index'),
            {
                search,
                per_page: perPage,
                sort_by: filters.sort_by,
                sort_direction: filters.sort_direction,
            },
            { preserveState: true, replace: true },
        );
    };

    const handlePerPageChange = (value: string) => {
        const newValue = parseInt(value);
        setPerPage(newValue);
        router.get(
            route('manage.jawaban.index'),
            {
                search,
                per_page: newValue,
                sort_by: filters.sort_by,
                sort_direction: filters.sort_direction,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSort = (column: string) => {
        let direction: 'asc' | 'desc' = 'asc';

        if (filters.sort_by === column) {
            direction = filters.sort_direction === 'asc' ? 'desc' : 'asc';
        }

        router.get(
            route('manage.jawaban.index'),
            {
                search,
                per_page: perPage,
                sort_by: column,
                sort_direction: direction,
            },
            { preserveState: true, replace: true },
        );
    };

    const getSortIcon = (column: string) => {
        if (filters.sort_by !== column) {
            return <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />;
        }

        return filters.sort_direction === 'asc' ? (
            <ArrowUp className="ml-1 h-4 w-4 text-blue-600" />
        ) : (
            <ArrowDown className="ml-1 h-4 w-4 text-blue-600" />
        );
    };

    const handlePageChange = (url: string) => {
        router.visit(url, { preserveState: true, replace: true });
    };

    const SortableTableHead = ({ column, children, className = '' }: { column: string; children: React.ReactNode; className?: string }) => (
        <TableHead className={className}>
            <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent" onClick={() => handleSort(column)}>
                <div className="flex items-center">
                    {children}
                    {getSortIcon(column)}
                </div>
            </Button>
        </TableHead>
    );

    return (
        <AppLayout>
            <Head title="Kelola Jawaban Ujian" />

            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold">Daftar Ujian</h1>

                {/* Search & Per Page Filter */}
                <div className="bg-muted/30 flex flex-col gap-4 rounded-lg p-4 md:flex-row md:items-center md:justify-between">
                    <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
                        <div className="relative w-full max-w-sm">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Cari nama ujian..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                            />
                        </div>
                        <Button type="submit">Cari</Button>
                    </form>

                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">Tampilkan:</span>
                        <Select value={String(perPage)} onValueChange={handlePerPageChange}>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator />

                {ujians.data.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-muted-foreground">
                            {filters.search ? `Tidak ada ujian ditemukan untuk "${filters.search}"` : 'Tidak ada ujian ditemukan.'}
                        </p>
                        {filters.search && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                    setSearch('');
                                    router.get(route('manage.jawaban.index'), { per_page: perPage });
                                }}
                            >
                                Clear Search
                            </Button>
                        )}
                    </div>
                ) : (
                    <div>
                        <CardHeader>
                            <CardTitle className="text-lg">Tabel Ujian</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>No</TableHead>
                                            <SortableTableHead column="nama_ujian">Nama Ujian</SortableTableHead>
                                            <SortableTableHead column="mata_pelajaran.nama_mapel">Mata Pelajaran</SortableTableHead>
                                            <SortableTableHead column="kelas.nama_kelas">Kelas</SortableTableHead>
                                            <SortableTableHead column="kelas.tahun_ajaran">Tahun Ajaran</SortableTableHead>
                                            <TableHead className="text-center">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ujians.data.map((ujian, index) => (
                                            <TableRow key={ujian.id}>
                                                <TableCell>{(ujians.current_page - 1) * ujians.per_page + index + 1}</TableCell>
                                                <TableCell className="font-medium">{ujian.nama_ujian}</TableCell>
                                                <TableCell>{ujian.mata_pelajaran?.nama_mapel}</TableCell>
                                                <TableCell>{ujian.kelas?.nama_kelas}</TableCell>
                                                <TableCell>{ujian.kelas?.tahun_ajaran}</TableCell>
                                                <TableCell className="text-center">
                                                    <Link href={`/manage-jawaban/ujian/${ujian.id}`}>
                                                        <Button size="sm">Lihat Jawaban</Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </div>
                )}

                {/* Pagination */}
                <Pagination
                    currentPage={ujians.current_page}
                    lastPage={ujians.last_page}
                    from={ujians.from}
                    to={ujians.to}
                    total={ujians.total}
                    links={ujians.links}
                    onPageChange={handlePageChange}
                />
            </div>
        </AppLayout>
    );
}
