import { PageHeader } from "@/src/components/page-header";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { bloodTypeOptions } from "@/src/lib/constants";
import { createClient } from "@/src/utils/supabase/server";
import Link from "next/link";
import { differenceInYears, parse } from "date-fns";

const calculateAge = (dob: string): number => {
  const date = parse(dob, "yyyy-MM-dd", new Date());
  const age = differenceInYears(new Date(), date);
  return age;
};

export default async function Records() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: records, error } = await supabase
    .from("personal_records")
    .select("name, health_card, blood_type, date_of_birth")
    .eq("owner_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <PageHeader page="list" />
        <div className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
          {records?.map(
            ({
              name,
              health_card: healthCard,
              blood_type: bloodType,
              date_of_birth: birthDateString,
            }) => {
              const age = calculateAge(birthDateString);
              const bloodTypeLabel = bloodTypeOptions.find(
                ({ value }) => value === bloodType
              )?.label;

              return (
                <Card
                  key={healthCard}
                  className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
                >
                  <CardHeader className="grid gap-4">
                    <CardTitle>{name}</CardTitle>
                    <div className="grid flex-1 auto-rows-min gap-0.5">
                      <div className="text-sm text-muted-foreground">
                        Health card
                      </div>
                      <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                        {healthCard}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex w-full items-center gap-2">
                      <div className="grid flex-1 auto-rows-min gap-0.5">
                        <div className="text-xs text-muted-foreground">
                          Blood
                        </div>
                        <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                          {bloodTypeLabel}
                        </div>
                      </div>
                      <Separator
                        orientation="vertical"
                        className="mx-2 h-10 w-px"
                      />
                      <div className="grid flex-1 auto-rows-min gap-0.5">
                        <div className="text-xs text-muted-foreground">Age</div>
                        <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                          {age}
                          <span className="text-sm font-normal text-muted-foreground">
                            years
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row border-t p-4">
                    <Button className="w-full" asChild>
                      <Link href={`/records/edit/${healthCard}/personal`}>
                        Edit
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            }
          )}
        </div>
      </main>
    </div>
  );
}
