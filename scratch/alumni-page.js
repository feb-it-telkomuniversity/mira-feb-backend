"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
    Users, 
    Briefcase, 
    GraduationCap, 
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

const COLORS = ["#009da5", "#f59e0b", "#3b82f6", "#ef4444", "#10b981", "#8b5cf6"];

export default function AlumniDashboard() {
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [prodiFilter, setProdiFilter] = useState("all");
    const [search, setSearch] = useState("");

    // Statistics state (aggregated manually since API doesn't provide it yet, we just aggregate what we have or assume based on page)
    // Wait, the API only returns paginated data, so we can't build a 100% accurate global chart without a stats endpoint.
    // However, we can aggregate the current page, OR we can fetch limit=1000 and calculate stats.
    const [fullData, setFullData] = useState([]);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [page, prodiFilter]);

    useEffect(() => {
        fetchStatsData();
    }, [prodiFilter]);

    const fetchStatsData = async () => {
        setStatsLoading(true);
        try {
            let url = `/api/alumni?limit=1000`; // Fetch max for stats
            if (prodiFilter !== "all") {
                url += `&prodi=${encodeURIComponent(prodiFilter)}`;
            }
            const res = await api.get(url);
            if (res.data?.status === "success") {
                setFullData(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setStatsLoading(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            let url = `/api/alumni?page=${page}&limit=${limit}`;
            if (prodiFilter !== "all") {
                url += `&prodi=${encodeURIComponent(prodiFilter)}`;
            }
            const res = await api.get(url);
            if (res.data?.status === "success") {
                setData(res.data.data);
                setMeta(res.data.meta);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Derived Statistics
    const totalAlumni = meta?.total || 0;
    const countBekerja = fullData.filter(d => d.status_saat_ini?.toLowerCase().includes("bekerja") && !d.status_saat_ini?.toLowerCase().includes("belum")).length;
    const countBelum = fullData.filter(d => d.status_saat_ini?.toLowerCase().includes("belum") || d.status_saat_ini?.toLowerCase().includes("mencari")).length;
    
    // Status Chart Data
    const statusCounts = fullData.reduce((acc, curr) => {
        const s = curr.status_saat_ini || "Tidak Diketahui";
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});
    const pieData = Object.keys(statusCounts).map(k => ({ name: k, value: statusCounts[k] }));

    // Angkatan Chart Data
    const angkatanCounts = fullData.reduce((acc, curr) => {
        const a = curr.angkatan || "Unknown";
        acc[a] = (acc[a] || 0) + 1;
        return acc;
    }, {});
    const barData = Object.keys(angkatanCounts).sort().map(k => ({ name: k, total: angkatanCounts[k] }));

    const filteredData = data.filter(d => d.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) || d.nim?.includes(search));

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Alumni</h2>
                    <p className="text-muted-foreground mt-1">Sistem Informasi Pengelolaan Data Alumni FEB Telkom University</p>
                </div>
                <div className="flex gap-2">
                    <Select value={prodiFilter} onValueChange={(val) => { setProdiFilter(val); setPage(1); }}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Pilih Program Studi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Program Studi</SelectItem>
                            {meta?.available_prodi?.map(p => (
                                <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-gray-200/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Alumni</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : totalAlumni}</div>
                        <p className="text-xs text-muted-foreground mt-1">Terdaftar dalam database</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-gray-200/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sudah Bekerja</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : countBekerja}</div>
                        <p className="text-xs text-muted-foreground mt-1">Sedang aktif bekerja</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-gray-200/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Belum Bekerja / Lanjut Studi</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (totalAlumni - countBekerja)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Termasuk magang dan studi lanjut</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Status Saat Ini</CardTitle>
                        <CardDescription>Persentase status pekerjaan alumni</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {statsLoading ? (
                            <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Sebaran Angkatan</CardTitle>
                        <CardDescription>Jumlah alumni berdasarkan tahun angkatan</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {statsLoading ? (
                            <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <RechartsTooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="total" fill="#009da5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Data Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                            <CardTitle>Direktori Alumni</CardTitle>
                            <CardDescription>Daftar lengkap alumni FEB Telkom University</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Cari nama atau NIM..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900 border-b">
                                <tr>
                                    <th className="px-4 py-3 font-medium">NIM</th>
                                    <th className="px-4 py-3 font-medium">Nama Lengkap</th>
                                    <th className="px-4 py-3 font-medium">Program Studi</th>
                                    <th className="px-4 py-3 font-medium">Angkatan</th>
                                    <th className="px-4 py-3 font-medium">Status Pekerjaan</th>
                                    <th className="px-4 py-3 font-medium">Perusahaan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="h-32 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                        </td>
                                    </tr>
                                ) : filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="h-32 text-center text-muted-foreground">
                                            Tidak ada data ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((alumni) => (
                                        <tr key={alumni.nim} className="border-b last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-4 py-3 text-muted-foreground">{alumni.nim}</td>
                                            <td className="px-4 py-3 font-medium">{alumni.nama_lengkap}</td>
                                            <td className="px-4 py-3">{alumni.prodi}</td>
                                            <td className="px-4 py-3">{alumni.angkatan}</td>
                                            <td className="px-4 py-3">
                                                <span className={"inline-flex items-center px-2 py-1 rounded-full text-xs font-medium " + 
                                                    (alumni.status_saat_ini?.toLowerCase().includes("bekerja") ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700")}>
                                                    {alumni.status_saat_ini || "-"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">{alumni.nama_perusahaan || "-"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {meta && (
                        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                            <div>
                                Menampilkan {(meta.page - 1) * meta.limit + 1} - {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} data
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1 || loading}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page >= meta.total_pages || loading}
                                >
                                    Next <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
