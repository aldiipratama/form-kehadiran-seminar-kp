
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center p-5 justify-center bg-background">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="text-2xl">404 - Halaman Tidak Ditemukan</CardTitle>
          <CardDescription>
            Maaf, halaman yang Anda cari tidak tersedia atau tidak ditemukan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full mt-4">
            <Link to="/">Kembali ke Beranda</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
