import { Book, BookMarked, User2 } from "lucide-react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Item,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "./components/ui/item";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/form", {
      replace: true,
      state: { fromHome: true },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="max-w-md w-full text-center gap-2">
        <CardHeader>
          <CardTitle className="text-2xl">
            Form Kehadiran Seminar Kerja Praktek
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ItemGroup className="mb-4">
            <Item variant={"outline"}>
              <ItemMedia>
                <User2 />
              </ItemMedia>
              <ItemTitle>Nama :</ItemTitle>
              <ItemDescription>Muhamad Rinaldi Agus Pratama</ItemDescription>
            </Item>

            <Item variant={"outline"}>
              <ItemMedia>
                <BookMarked />
              </ItemMedia>
              <ItemTitle>NPM :</ItemTitle>
              <ItemDescription>223040166</ItemDescription>
            </Item>

            <Item variant={"outline"}>
              <ItemMedia>
                <Book />
              </ItemMedia>
              <ItemTitle>Judul KP :</ItemTitle>
              <ItemDescription>
                PERANCANGAN KONTEN VISUAL MEDIA SOSIAL SEBAGAI MEDIA INFORMASI
                PERUSAHAAN
              </ItemDescription>
            </Item>
          </ItemGroup>

          <CardDescription>
            Silakan klik tombol di bawah untuk mulai mengisi kehadiran seminar
            KP.
          </CardDescription>
          <CardFooter>
            <Button onClick={handleClick} className="w-full mt-4">
              Isi Kehadiran
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
