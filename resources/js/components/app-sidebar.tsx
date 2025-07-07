// import { NavFooter } from '@/components/nav-footer';
// import { NavMain } from '@/components/nav-main';
// import { NavUser } from '@/components/nav-user';
// import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
// import { type NavItem } from '@/types';
// import { Link, usePage } from '@inertiajs/react';
// import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
// import AppLogo from './app-logo';

// const mainNavItems: NavItem[] = [
//     {
//         title: 'Dashboard',
//         href: '/dashboard',
//         icon: LayoutGrid,
//     },
//     {
//         title: 'Siswa',
//         href: '/siswa',
//         icon: LayoutGrid,
//     },
//     {
//         title: 'Kelas',
//         href: '/kelas',
//         icon: LayoutGrid,
//     },
//     {
//         title: 'Mata Pelajaran',
//         href: '/mata_pelajaran',
//         icon: LayoutGrid,
//     },
//     {
//         title: 'Ujian',
//         href: '/ujian',
//         icon: LayoutGrid,
//     },
// ];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

// export function AppSidebar() {
//     const { props } = usePage();
//     const user = props.auth?.user;

//     // Check if user is a student (has siswa relation)
//     const isStudent = user?.siswa !== null && user?.siswa !== undefined;

//     // Filter menu items based on user role
//     const filteredNavItems = mainNavItems.filter((item) => {
//         if (isStudent) {
//             // Hide these menus for students
//             const hiddenMenus = ['Siswa', 'Kelas', 'Mata Pelajaran', 'Ujian'];
//             return !hiddenMenus.includes(item.title);
//         }
//         return true; // Show all menus for non-students
//     });
//     return (
//         <Sidebar collapsible="icon" variant="inset">
//             <SidebarHeader>
//                 <SidebarMenu>
//                     <SidebarMenuItem>
//                         <SidebarMenuButton size="lg" asChild>
//                             <Link href="/dashboard" prefetch>
//                                 <AppLogo />
//                             </Link>
//                         </SidebarMenuButton>
//                     </SidebarMenuItem>
//                 </SidebarMenu>
//             </SidebarHeader>

//             <SidebarContent>
//                 {/* <NavMain items={mainNavItems} /> */}
//                 <NavMain items={filteredNavItems} />
//             </SidebarContent>

//             <SidebarFooter>
//                 <NavFooter items={footerNavItems} className="mt-auto" />
//                 <NavUser />
//             </SidebarFooter>
//         </Sidebar>
//     );
// }
// import { NavFooter } from '@/components/nav-footer';
// import { NavMain } from '@/components/nav-main';
// import { NavUser } from '@/components/nav-user';
// import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
// import { type NavItem } from '@/types';
// import { Link, usePage } from '@inertiajs/react';
// import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
// import AppLogo from './app-logo';

// const mainNavItems: NavItem[] = [
//     {
//         title: 'Dashboard',
//         href: '/dashboard',
//         icon: LayoutGrid,
//     },
//     {
//         title: 'Siswa',
//         href: '/siswa',
//         icon: LayoutGrid,
//     },
//     {
//         title: 'Kelas',
//         href: '/kelas',
//         icon: LayoutGrid,
//     },
//     {
//         title: 'Mata Pelajaran',
//         href: '/mata_pelajaran',
//         icon: LayoutGrid,
//     },
//     {
//         title: 'Ujian',
//         href: '/ujian',
//         icon: LayoutGrid,
//     },
// ];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

// export function AppSidebar() {
//     const { props } = usePage();
//     const user = props.auth?.user;

//     const isStudent = user?.siswa !== null && user?.siswa !== undefined;

//     const filteredNavItems = mainNavItems.filter((item) => {
//         if (isStudent) {
//             const hiddenMenus = ['Siswa', 'Kelas', 'Mata Pelajaran', 'Ujian'];
//             return !hiddenMenus.includes(item.title);
//         }
//         return true;
//     });

//     return (
//         <Sidebar collapsible="icon" variant="inset">
//             <SidebarHeader>
//                 <SidebarMenu>
//                     <SidebarMenuItem>
//                         <SidebarMenuButton size="lg" asChild>
//                             <Link href="/dashboard" prefetch>
//                                 <AppLogo />
//                             </Link>
//                         </SidebarMenuButton>
//                     </SidebarMenuItem>
//                 </SidebarMenu>
//             </SidebarHeader>

//             <SidebarContent>
//                 <NavMain items={filteredNavItems} />
//             </SidebarContent>

//             <SidebarFooter>
//                 <NavFooter items={footerNavItems} className="mt-auto" />
//                 <NavUser />
//             </SidebarFooter>
//         </Sidebar>
//     );
// }
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Pencil } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { props } = usePage();
    const user = props.auth?.user;

    // const isStudent = user?.siswa !== null && user?.siswa !== undefined;
    const isStudent = !!user?.siswa;

    // Menu khusus admin/operator
    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Siswa',
            href: '/siswa',
            icon: LayoutGrid,
        },
        {
            title: 'Kelas',
            href: '/kelas',
            icon: LayoutGrid,
        },
        {
            title: 'Mata Pelajaran',
            href: '/mata_pelajaran',
            icon: LayoutGrid,
        },
        {
            title: 'Ujian',
            href: '/ujian',
            icon: LayoutGrid,
        },
    ];

    // Menu khusus siswa
    const studentNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Kerjakan Ujian',
            href: '/soal-ujian', // atau '/soal-ujian'
            icon: Pencil,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    const finalNavItems = isStudent ? studentNavItems : adminNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={finalNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
