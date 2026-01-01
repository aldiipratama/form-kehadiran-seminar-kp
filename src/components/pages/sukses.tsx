import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export const SuksesPage = () => {
  return (
    <div className="flex min-h-screen items-center p-5 justify-center bg-background">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CheckCircle2 className="mx-auto mb-2 text-green-500" size={48} />
          <CardTitle className="text-2xl">
            Kehadiran Berhasil Dicatat!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Terima kasih, kehadiran Anda telah berhasil dicatat.
            <br />
            Silakan tunjukkan halaman ini kepada dosen/panitia jika diperlukan.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};
