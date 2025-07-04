import AlertDialogDelete from '@/components/alert-dialog-delete';
import HeadingSmall from '@/components/heading-small';
import Pagination from '@/components/pagination';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Search, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ArrowUpDown, SortAsc, SortDesc } from 'lucide-react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kelas',
        href: '/kelas',
    },
];

interface Kelas {
    id: string;
    nama_kelas: string;
    tahun_ajaran?: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedKelas {
    data: Kelas[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface PageProps {
    flash?: {
        message?: string;
    };
    kelas: PaginatedKelas;
    filters: {
        search: string;
        per_page: number;
        sort_by: string;
        sort_direction: 'asc' | 'desc';
    };
}

export default function Index() {
    const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [sortBy, setSortBy] = useState('nama_kelas');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const { kelas, flash, filters } = usePage().props as unknown as PageProps;
    const { processing, delete: destroy } = useForm();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (kelas) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [kelas]);

    useEffect(() => {
        setSearchTerm(filters.search);
        setPerPage(filters.per_page);
        setSortBy(filters.sort_by || 'nama_kelas');
        setSortDirection(filters.sort_direction || 'asc');
    }, [filters]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('kelas.index'),
            {
                search: searchTerm,
                per_page: perPage,
                sort_by: sortBy,
                sort_direction: sortDirection,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handlePerPageChange = (value: string) => {
        const newPerPage = parseInt(value);
        setPerPage(newPerPage);
        router.get(
            route('kelas.index'),
            {
                search: searchTerm,
                per_page: newPerPage,
                sort_by: sortBy,
                sort_direction: sortDirection,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handlePageChange = (url: string) => {
        router.visit(url, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = () => {
        if (selectedKelas) {
            destroy(route('kelas.destroy', selectedKelas.id));
            setSelectedKelas(null);
        }
    };

    const handleSort = (column: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortBy === column) {
            direction = sortDirection === 'asc' ? 'desc' : 'asc';
        }

        setSortBy(column);
        setSortDirection(direction);

        router.get(
            route('kelas.index'),
            {
                search: searchTerm,
                per_page: perPage,
                sort_by: column,
                sort_direction: direction,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const renderSkeletonRows = () => {
        return Array.from({ length: perPage }).map((_, i) => (
            <TableRow key={i}>
                <TableCell>
                    <Skeleton className="h-5 w-8" />
                </TableCell>
                <TableCell className="w-[180px]">
                    <Skeleton className="h-5 w-[160px]" />
                </TableCell>
                <TableCell className="w-[120px]">
                    <Skeleton className="h-5 w-[100px]" />
                </TableCell>
                <TableCell>
                    <div className="flex justify-center gap-2">
                        <Skeleton className="h-9 w-[64px]" />
                        <Skeleton className="h-9 w-[76px]" />
                    </div>
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelas" />

            <div className="space-y-6 px-4 py-6">
                <HeadingSmall title="Kelas" description="Manage and view your created Kelas" />

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Kelas List</h2>
                    <Link href={route('kelas.create')}>
                        <Button>Add Kelas</Button>
                    </Link>
                </div>

                <div className="bg-muted/30 flex items-center gap-4 rounded-lg p-4">
                    <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
                        <div className="relative max-w-sm flex-1">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                            <Input
                                placeholder="Search by nama_kelas"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            Search
                        </Button>
                    </form>

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
                    <Alert variant="default" className="bg-muted/50 border-l-4">
                        <Terminal className="h-5 w-5" />
                        <div>
                            <AlertTitle>Notification</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {!isLoading && kelas.data.length === 0 ? (
                    <div className="py-8 text-center">
                        <div className="text-muted-foreground text-sm italic">
                            {filters.search ? `No kelas found matching "${filters.search}"` : 'No kelas available.'}
                        </div>
                        {filters.search && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                    setSearchTerm('');
                                    router.get(route('kelas.index'), {
                                        per_page: perPage,
                                        sort_by: sortBy,
                                        sort_direction: sortDirection,
                                    });
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
                                    <TableHead className="w-[40px]">#</TableHead>
                                    <TableHead
                                        className="cursor-pointer w-[180px]"
                                        onClick={() => handleSort('nama_kelas')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Nama Kelas
                                            {sortBy === 'nama_kelas' ? (
                                                sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                                            ) : (
                                                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer w-[120px]"
                                        onClick={() => handleSort('tahun_ajaran')}
                                    >
                                        <div className="flex items-center gap-1">

                                            Tahun Ajaran  {sortBy === 'tahun_ajaran' ? (
                                                sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                                            ) : (
                                                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading
                                    ? renderSkeletonRows()
                                    : (() => {
                                          let rowNumber = (kelas.current_page - 1) * kelas.per_page + 1;

                                          return kelas.data.map((kelas) => (
                                              <TableRow key={kelas.id}>
                                                  <TableCell>{rowNumber++}</TableCell>
                                                  <TableCell className="font-medium">{kelas.nama_kelas}</TableCell>
                                                  <TableCell>{kelas.tahun_ajaran || '-'}</TableCell>
                                                  <TableCell className="text-center">
                                                      <div className="flex justify-center gap-2">
                                                          <Link href={`/kelas/${kelas.id}/detail`}>
                                                              <Button variant="update" size="sm">
                                                                  Detail
                                                              </Button>
                                                          </Link>
                                                          <Link href={`/kelas/${kelas.id}/edit`}>
                                                              <Button variant="update" size="sm">
                                                                  Edit
                                                              </Button>
                                                          </Link>
                                                          <AlertDialogDelete
                                                              title="Are you sure?"
                                                              description={`This will permanently delete the kelas "${kelas.nama_kelas}".`}
                                                              onConfirm={handleDelete}
                                                              loading={processing}
                                                          >
                                                              <Button
                                                                  variant="destructive"
                                                                  size="sm"
                                                                  onClick={() => setSelectedKelas(kelas)}
                                                                  disabled={processing}
                                                              >
                                                                  Delete
                                                              </Button>
                                                          </AlertDialogDelete>
                                                      </div>
                                                  </TableCell>
                                              </TableRow>
                                          ));
                                      })()}
                            </TableBody>
                        </Table>
                        <Pagination
                            currentPage={kelas.current_page}
                            lastPage={kelas.last_page}
                            from={kelas.from}
                            to={kelas.to}
                            total={kelas.total}
                            links={kelas.links}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
