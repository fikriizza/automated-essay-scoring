import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Eye, Plus, Search, Terminal, Trash2 } from 'lucide-react';

interface UjianItem {
    id: string;
    nama_ujian: string;
    kelas: {
        id: string;
        nama_kelas: string;
        tahun_ajaran: string;
    };
    mata_pelajaran: {
        id: string;
        nama_mapel: string;
    };
    soals_count?: number;
}

interface PaginatedData {
    data: UjianItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    from: number;
    to: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface PageProps {
    ujians: PaginatedData;
    flash?: {
        message?: string;
    };
    filters: {
        search?: string;
        per_page?: number;
        sort_by?: string;
        sort_direction?: 'asc' | 'desc';
    };
}

const breadcrumbs = [{ title: 'Ujian', href: '/ujian' }];

export default function Index() {
    const [searchTerm, setSearchTerm] = useState('');
    const [perPage, setPerPage] = useState(10);
    const { ujians, flash, filters } = usePage().props as PageProps;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (ujians) {
            const timer = setTimeout(() => setIsLoading(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [ujians]);

    useEffect(() => {
        setSearchTerm(filters.search ?? '');
        setPerPage(filters.per_page ?? 10);
    }, [filters]);

    const handleSearch = () => {
        router.get(
            route('ujian.index'),
            {
                search: searchTerm,
                per_page: perPage,
                sort_by: filters.sort_by,
                sort_direction: filters.sort_direction,
            },
            { preserveState: true, replace: true },
        );
    };

    const handlePerPageChange = (value: string) => {
        const newPerPage = parseInt(value);
        setPerPage(newPerPage);
        router.get(
            route('ujian.index'),
            {
                search: searchTerm,
                per_page: newPerPage,
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
            route('ujian.index'),
            {
                search: searchTerm,
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

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus ujian ini?')) {
            router.delete(route('ujian.destroy', id));
        }
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ujian" />
            <div className="space-y-6 px-4 py-6">
                <HeadingSmall title="Ujian" description="Kelola ujian berdasarkan kelas dan mata pelajaran" />

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Daftar Ujian</h2>
                    <Link href={route('ujian.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Ujian
                        </Button>
                    </Link>
                </div>

                <div className="bg-muted/30 flex flex-wrap items-center gap-4 rounded-lg p-4">
                    <div className="flex flex-1 gap-2">
                        <div className="relative max-w-sm flex-1">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Cari berdasarkan ujian, kelas, atau mapel..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <Button onClick={handleSearch} disabled={isLoading}>
                            Search
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">Show:</span>
                        <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                            <SelectTrigger className="w-20">
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

                {flash?.message && (
                    <Alert className="bg-muted/50 border-l-4">
                        <Terminal className="h-5 w-5" />
                        <div>
                            <AlertTitle>Notification</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {!isLoading && ujians.data.length === 0 ? (
                    <div className="py-8 text-center">
                        <div className="text-muted-foreground text-sm italic">
                            {filters.search ? `Tidak ada ujian ditemukan untuk "${filters.search}"` : 'Belum ada ujian.'}
                        </div>
                        {filters.search && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                    setSearchTerm('');
                                    router.get(route('ujian.index'), { per_page: perPage });
                                }}
                            >
                                Clear Search
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <SortableTableHead column="nama_ujian">Nama Ujian</SortableTableHead>
                                    <SortableTableHead column="kelas.nama_kelas">Kelas</SortableTableHead>
                                    <SortableTableHead column="kelas.tahun_ajaran">Tahun Ajaran</SortableTableHead>
                                    <SortableTableHead column="mata_pelajaran.nama_mapel">Mata Pelajaran</SortableTableHead>
                                    <SortableTableHead column="soals_count" className="text-center">
                                        Jumlah Soal
                                    </SortableTableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading
                                    ? Array.from({ length: perPage }).map((_, i) => (
                                          <TableRow key={i}>
                                              <TableCell>
                                                  <Skeleton className="h-5 w-8" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-5 w-32" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-5 w-28" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-5 w-20" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-5 w-28" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-5 w-16" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-9 w-32" />
                                              </TableCell>
                                          </TableRow>
                                      ))
                                    : ujians.data.map((ujian, i) => (
                                          <TableRow key={ujian.id}>
                                              <TableCell>{(ujians.current_page - 1) * ujians.per_page + i + 1}</TableCell>
                                              <TableCell className="font-medium">{ujian.nama_ujian}</TableCell>
                                              <TableCell>{ujian.kelas ? ujian.kelas.nama_kelas : '-'}</TableCell>
                                              <TableCell>{ujian.kelas ? ujian.kelas.tahun_ajaran : '-'}</TableCell>
                                              <TableCell>{ujian.mata_pelajaran?.nama_mapel}</TableCell>
                                              <TableCell className="text-center">
                                                  <Badge variant="secondary">{ujian.soals_count || 0} soal</Badge>
                                              </TableCell>
                                              <TableCell className="text-center">
                                                  <div className="flex justify-center gap-2">
                                                      <Link href={route('ujian.manage_soal', ujian.id)}>
                                                          <Button variant="default" size="sm">
                                                              <Eye className="mr-1 h-3 w-3" />
                                                              Kelola Soal
                                                          </Button>
                                                      </Link>
                                                      <Button variant="destructive" size="sm" onClick={() => handleDelete(ujian.id)}>
                                                          <Trash2 className="mr-1 h-3 w-3" />
                                                          Hapus
                                                      </Button>
                                                  </div>
                                              </TableCell>
                                          </TableRow>
                                      ))}
                            </TableBody>
                        </Table>

                        {ujians.last_page > 1 && (
                            <div className="flex items-center justify-between">
                                <div className="text-muted-foreground text-sm">
                                    Showing {ujians.from} to {ujians.to} of {ujians.total} results
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => ujians.links[0].url && handlePageChange(ujians.links[0].url)}
                                        disabled={ujians.current_page === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {ujians.links.slice(1, -1).map((link, i) => (
                                            <Button
                                                key={i}
                                                variant={link.active ? 'secondary' : 'outline'}
                                                size="sm"
                                                onClick={() => link.url && handlePageChange(link.url)}
                                                className="min-w-[40px]"
                                            >
                                                {link.label}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => ujians.links.at(-1)?.url && handlePageChange(ujians.links.at(-1)!.url)}
                                        disabled={ujians.current_page === ujians.last_page}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
