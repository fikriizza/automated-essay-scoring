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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Siswa',
        href: '/siswa',
    },
];
interface Siswa {
    id: string;
    nama: string;
    nisn?: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedSiswas {
    data: Siswa[];
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
    siswas: PaginatedSiswas;
    filters: {
        search: string;
        per_page: number;
    };
}

export default function Index() {
    const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [perPage, setPerPage] = useState(10);
    const { siswas, flash, filters } = usePage().props as unknown as PageProps;
    const { processing, delete: destroy } = useForm();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (siswas) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [siswas]);

    useEffect(() => {
        setSearchTerm(filters.search);
        setPerPage(filters.per_page);
    }, [filters]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('siswa.index'),
            {
                search: searchTerm,
                per_page: perPage,
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
            route('siswa.index'),
            {
                search: searchTerm,
                per_page: newPerPage,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDelete = () => {
        if (selectedSiswa) {
            destroy(route('siswa.destroy', selectedSiswa.id));
            setSelectedSiswa(null);
        }
    };

    const handlePageChange = (url: string) => {
        router.visit(url, {
            preserveState: true,
            replace: true,
        });
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
            <Head title="Siswa" />

            <div className="space-y-6 px-4 py-6">
                <HeadingSmall title="Siswa" description="Manage and view your created Siswa" />

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Siswa List</h2>
                    <Link href={route('siswa.create')}>
                        <Button>Add Siswa</Button>
                    </Link>
                </div>

                <div className="bg-muted/30 flex items-center gap-4 rounded-lg p-4">
                    <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
                        <div className="relative max-w-sm flex-1">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                            <Input
                                placeholder="Search by nama"
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

                {!isLoading && siswas.data.length === 0 ? (
                    <div className="py-8 text-center">
                        <div className="text-muted-foreground text-sm italic">
                            {filters.search ? `No siswas found matching "${filters.search}"` : 'No siswas available.'}
                        </div>
                        {filters.search && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                    setSearchTerm('');
                                    router.get(route('siswa.index'), { per_page: perPage });
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
                                    <TableHead className="w-[180px]">Name</TableHead>
                                    <TableHead className="w-[120px]">NISN</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading
                                    ? renderSkeletonRows()
                                    : (() => {
                                          let rowNumber = (siswas.current_page - 1) * siswas.per_page + 1;

                                          return siswas.data.map((siswa) => (
                                              <>
                                                  <TableRow key={siswa.id}>
                                                      <TableCell>{rowNumber++}</TableCell>
                                                      <TableCell className="font-medium">{siswa.nama}</TableCell>
                                                      <TableCell>{siswa.nisn || '-'}</TableCell>
                                                      <TableCell className="text-center">
                                                          <div className="flex justify-center gap-2">
                                                              <Link href={`/siswa/${siswa.id}/edit`}>
                                                                  <Button variant="update" size="sm">
                                                                      Edit
                                                                  </Button>
                                                              </Link>
                                                              <AlertDialogDelete
                                                                  title="Are you sure?"
                                                                  description={`This will permanently delete the siswa "${siswa.nama}".`}
                                                                  onConfirm={handleDelete}
                                                                  loading={processing}
                                                              >
                                                                  <Button
                                                                      variant="destructive"
                                                                      size="sm"
                                                                      onClick={() => setSelectedSiswa(siswa)}
                                                                      disabled={processing}
                                                                  >
                                                                      Delete
                                                                  </Button>
                                                              </AlertDialogDelete>
                                                          </div>
                                                      </TableCell>
                                                  </TableRow>
                                              </>
                                          ));
                                      })()}
                            </TableBody>
                        </Table>
                        <Pagination
                            currentPage={siswas.current_page}
                            lastPage={siswas.last_page}
                            from={siswas.from}
                            to={siswas.to}
                            total={siswas.total}
                            links={siswas.links}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
