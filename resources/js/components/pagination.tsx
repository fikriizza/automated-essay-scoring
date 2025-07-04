import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    from: number;
    to: number;
    total: number;
    links: PaginationLink[];
    onPageChange: (url: string) => void;
}

export default function Pagination({ currentPage, lastPage, from, to, total, links, onPageChange }: PaginationProps) {
    if (lastPage <= 1) return null;

    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];

        if (lastPage <= 7) {
            for (let i = 1; i <= lastPage; i++) {
                pages.push(i);
            }
            return pages;
        }

        const middlePages: number[] = [];

        let start = Math.max(currentPage - 1, 2);
        let end = Math.min(currentPage + 1, lastPage - 1);

        if (currentPage === 1) {
            end = 3;
        } else if (currentPage === lastPage) {
            start = lastPage - 2;
        }

        for (let i = start; i <= end; i++) {
            middlePages.push(i);
        }

        pages.push(1);

        if (start > 2) {
            pages.push('...');
        }

        pages.push(...middlePages);

        if (end < lastPage - 1) {
            pages.push('...');
        }

        pages.push(lastPage);

        return pages;
    };

    const getPageUrl = (pageNumber: number) => {
        const pageLink = links.find((link) => {
            const linkPageNumber = parseInt(link.label);
            return !isNaN(linkPageNumber) && linkPageNumber === pageNumber;
        });
        return pageLink?.url;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                Showing {from} to {to} of {total} results
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => links[0].url && onPageChange(links[0].url)} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>

                <div className="flex items-center gap-1">
                    {pageNumbers.map((page, index) => {
                        if (page === '...') {
                            return (
                                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                                    ...
                                </span>
                            );
                        }

                        const pageNumber = page as number;
                        const pageUrl = getPageUrl(pageNumber);
                        const isActive = pageNumber === currentPage;

                        return (
                            <Button
                                key={pageNumber}
                                variant={isActive ? 'secondary' : 'outline'}
                                size="sm"
                                onClick={() => pageUrl && onPageChange(pageUrl)}
                                disabled={!pageUrl}
                                className="min-w-[40px]"
                            >
                                {pageNumber}
                            </Button>
                        );
                    })}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => links[links.length - 1].url && onPageChange(links[links.length - 1].url)}
                    disabled={currentPage === lastPage}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
