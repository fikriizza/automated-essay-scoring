import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface AlertDialogDeleteProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    onConfirm: () => void;
    loading?: boolean;
}

export default function AlertDialogDelete({ children, title, description, onConfirm, loading = false }: AlertDialogDeleteProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description ?? 'This action cannot be undone. Are you sure you want to proceed?'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} disabled={loading} className="bg-destructive hover:bg-destructive/90">
                        {loading ? 'Deleting...' : 'Yes, Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
