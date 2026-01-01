import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export const SuksesPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CheckCircle2 className="mx-auto mb-2 text-green-500" size={48} />
          <CardTitle className="text-2xl">Kehadiran Berhasil Dicatat!</CardTitle>
          <CardDescription>
            Terima kasih, kehadiran Anda telah berhasil dicatat.<br />
            Silakan tunjukkan halaman ini kepada dosen/panitia jika diperlukan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full mt-4">
            <Link to="/">Kembali ke Form</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};