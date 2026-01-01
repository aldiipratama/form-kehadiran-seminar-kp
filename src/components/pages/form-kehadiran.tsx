import { FormKehadiranSchema } from "@/schemas/form-kehadiran.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectValue } from "@radix-ui/react-select";
import {
  BadgeCheck,
  BookMarkedIcon,
  Loader2,
  School,
  Trash2,
  User2,
} from "lucide-react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "sonner";
import type z from "zod";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "../ui/select";
import supabase from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Form() {
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const [signatureReady, setSignatureReady] = useState<string>("");

  const navigate = useNavigate();

  const formKehadiran = useForm<z.infer<typeof FormKehadiranSchema>>({
    resolver: zodResolver(FormKehadiranSchema),
    mode: "onChange",
  });

  const signatureClear = () => {
    signatureRef.current?.clear();
    setSignatureReady("");
    formKehadiran.resetField("tanda_kehadiran");
  };

  const handleSignatureEnd = async () => {
    const dataUrl = signatureRef.current?.toDataURL("image/png");
    if (!dataUrl) return;

    setSignatureReady(dataUrl);
    formKehadiran.setValue("tanda_kehadiran", dataUrl, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleOnSubmit = async (data: z.infer<typeof FormKehadiranSchema>) => {
    try {
      const blob = await (await fetch(data.tanda_kehadiran)).blob();
      const filename = `${crypto.randomUUID()}_${data.npm}-signature.png`;

      const { data: existing } = await supabase
        .from("kehadiran_seminar_kp")
        .select("id")
        .eq("npm", data.npm)
        .maybeSingle();

      if (existing) {
        toast.error(`NPM ${data.npm} sudah melakukan kehadiran.`);
        return;
      }

      const { error: uploadError } = await supabase.storage
        .from("signature_url")
        .upload(filename, blob, {
          contentType: "image/png",
        });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = await supabase.storage
        .from("signature_url")
        .getPublicUrl(filename);

      const { error: insertError } = await supabase
        .from("kehadiran_seminar_kp")
        .insert([
          {
            nama_lengkap: data.nama_lengkap,
            npm: data.npm,
            kelas: data.kelas,
            status_kehadiran: data.status_kehadiran,
            signature_url: publicUrlData.publicUrl,
          },
        ]);

      if (insertError) {
        await supabase.storage.from("signature_url").remove([filename]);
        throw insertError;
      }

      toast.success("Kehadiran sudah dicatat.");
      navigate("/success", {
        replace: true,
        state: { fromSubmit: true },
      });
    } catch (error) {
      console.log(error);
      toast.error("Ada kesalahan saat mencatat kehadiran.");
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="gap-0 justify-center">
        <CardTitle className="text-2xl">
          Kehadiran Seminar Kerja Praktek
        </CardTitle>
        <CardDescription className="italic">
          Digunakan untuk pencatatan kehadiran peserta seminar KP.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="form-kehadiran"
          onSubmit={formKehadiran.handleSubmit(handleOnSubmit)}
        >
          <FieldSet>
            <FieldGroup>
              <Controller
                control={formKehadiran.control}
                name="nama_lengkap"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="nama-lengkap">
                      Nama Lengkap :
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <User2 />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="nama-lengkap"
                        placeholder="Contoh: John Doe"
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                    </InputGroup>
                    <div className="flex items-center">
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {field.value ? field.value.length : "0"}/30 Karakter
                      </span>
                    </div>
                  </Field>
                )}
              />

              <Controller
                control={formKehadiran.control}
                name="npm"
                render={({ field: { onChange, ...field }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="npm">NPM</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <BookMarkedIcon />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="npm"
                        placeholder="Contoh: 223040166"
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => {
                          const onlyNumber = e.target.value.replace(/\D/g, "");
                          onChange(onlyNumber);
                        }}
                        {...field}
                      />
                    </InputGroup>
                    <div className="flex items-center">
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {field.value ? field.value.length : "0"}/9 Karakter
                      </span>
                    </div>
                  </Field>
                )}
              />

              <Controller
                control={formKehadiran.control}
                name="kelas"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Kelas</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <School />
                          <SelectValue placeholder="Pilih Kelas" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Kelas</SelectLabel>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={formKehadiran.control}
                name="status_kehadiran"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Status Kehadiran</FieldLabel>
                    <RadioGroup
                      className="flex gap-5"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <Field orientation={"horizontal"} className="w-max">
                        <RadioGroupItem value="Dosen" id="dosen" />
                        <FieldLabel htmlFor="dosen">Dosen</FieldLabel>
                      </Field>
                      <Field orientation={"horizontal"} className="w-max">
                        <RadioGroupItem value="Mahasiswa" id="mahasiswa" />
                        <FieldLabel htmlFor="mahasiswa">Mahasiswa</FieldLabel>
                      </Field>
                      <Field orientation={"horizontal"} className="w-max">
                        <RadioGroupItem value="Tamu" id="tamu" />
                        <FieldLabel htmlFor="tamu">Tamu</FieldLabel>
                      </Field>
                    </RadioGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={formKehadiran.control}
                name="tanda_kehadiran"
                render={({ fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Tanda Konfirmasi Kehadiran</FieldLabel>
                    <SignatureCanvas
                      ref={signatureRef}
                      canvasProps={{
                        className: "border rounded-md shadow",
                        height: "200px",
                      }}
                      aria-invalid={fieldState.invalid}
                      onEnd={handleSignatureEnd}
                    />
                    <div className="flex justify-between items-center">
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      <Button
                        type="button"
                        variant={"destructive"}
                        onClick={signatureClear}
                        className="ml-auto"
                      >
                        <Trash2 />
                        Reset Tanda
                      </Button>
                    </div>
                  </Field>
                )}
              />

              {!formKehadiran.formState.isValid && (
                <p className="text-xs text-destructive -mb-5 text-center">
                  Harap isi semua Field terlebih dahulu.
                </p>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    disabled={!formKehadiran.formState.isValid}
                  >
                    Kirim Kehadiran
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Konfirmasi Data Kehadiran</DialogTitle>
                    <DialogDescription>
                      Mohon periksa kembali data yang telah diisi sebelum
                      mengirim kehadiran.
                    </DialogDescription>
                  </DialogHeader>

                  <ItemGroup className="grid grid-cols-2">
                    <Item>
                      <ItemMedia>
                        <BadgeCheck />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Nama Lengkap :</ItemTitle>
                        <ItemDescription>
                          {formKehadiran.getValues("nama_lengkap")}
                        </ItemDescription>
                      </ItemContent>
                    </Item>

                    <Item>
                      <ItemMedia>
                        <BadgeCheck />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>NPM :</ItemTitle>
                        <ItemDescription>
                          {formKehadiran.getValues("npm")}
                        </ItemDescription>
                      </ItemContent>
                    </Item>

                    <Item>
                      <ItemMedia>
                        <BadgeCheck />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Kelas :</ItemTitle>
                        <ItemDescription>
                          {formKehadiran.getValues("kelas")}
                        </ItemDescription>
                      </ItemContent>
                    </Item>

                    <Item>
                      <ItemMedia>
                        <BadgeCheck />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Status Kehadiran :</ItemTitle>
                        <ItemDescription>
                          {formKehadiran.getValues("status_kehadiran")}
                        </ItemDescription>
                      </ItemContent>
                    </Item>

                    <Item>
                      <ItemMedia>
                        <BadgeCheck />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Tanda Konfirmasi Kehadiran :</ItemTitle>
                        <ItemDescription>
                          {signatureReady && (
                            <img src={signatureReady} alt="signature" />
                          )}
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  </ItemGroup>

                  <DialogFooter>
                    <Button type="submit" form="form-kehadiran">
                      {formKehadiran.formState.isSubmitting ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Konfirmasi & Kirim"
                      )}
                    </Button>
                    <DialogClose>Batal</DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <FieldDescription className="text-center">
                Waktu kehadiran akan tercatat secara otomatis saat data dikirim.
              </FieldDescription>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
