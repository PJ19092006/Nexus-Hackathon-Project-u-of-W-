// this needs to be updated or removed fully as it might not work

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegCompo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Individual</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="tabs-full-name">Full Name</Label>
          <Input id="tabs-full-name" />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="tabs-grade">Grade</Label>
          <Input id="tabs-grade" />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="tabs-school-name">School Name</Label>
          <Input id="tabs-school-name" />
        </div>
        <div className="grid gap-3">
          <Calendar22 />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="tabs-contact-number">Contact Number</Label>
          <Input id="tabs-contact-number" type="number" />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="tabs-email">Email</Label>
          <Input id="tabs-email" type="email" />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="tabs-experience">Previous Mun Experience</Label>
          <Textarea id="tabs-experience" />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="tabs-committee-preference-1">
            Committee Preference 1
          </Label>
          <Select id="tabs-committee-preference-1">
            <SelectTrigger className="w-[350px]">
              <SelectValue placeholder="Select a committee" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>committees</SelectLabel>
                <SelectItem value="UNSC">
                  United Nations Security council
                </SelectItem>
                <SelectItem value="UNGA">
                  United Nations general Assembly
                </SelectItem>
                <SelectItem value="UNEP">
                  United Nations Environment Programme
                </SelectItem>
                <SelectItem value="AIPPM">
                  All India Political Party Meet
                </SelectItem>
                <SelectItem value="WHSR">White House Situation Room</SelectItem>
                <SelectItem value="ODC">
                  United Nations Office on Drugs and Crime
                </SelectItem>
                <SelectItem value="COPUOS">
                  Committee on the Peaceful Uses of Outer Space
                </SelectItem>
                <SelectItem value="CSW">
                  Commission on the Status of Wome
                </SelectItem>
                <SelectItem value="WHO">World Health Organisation</SelectItem>
                <SelectItem value="UNHRC">
                  United Nations High Commissioner for Refugees
                </SelectItem>
                <SelectItem value="UNICEF">
                  United Nations International Children's Emergency Fund
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="tabs-portfolio-preference-1">
            Portfolio Preference 1
          </Label>
          <Select id="tabs-portfolio-preference-1">
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a Portfolio 1" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>North America</SelectLabel>
                <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                <SelectItem value="mst">
                  Mountain Standard Time (MST)
                </SelectItem>
                <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                <SelectItem value="akst">
                  Alaska Standard Time (AKST)
                </SelectItem>
                <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Europe & Africa</SelectLabel>
                <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                <SelectItem value="cet">Central European Time (CET)</SelectItem>
                <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                <SelectItem value="west">
                  Western European Summer Time (WEST)
                </SelectItem>
                <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Asia</SelectLabel>
                <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                <SelectItem value="cst_china">
                  China Standard Time (CST)
                </SelectItem>
                <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
                <SelectItem value="ist_indonesia">
                  Indonesia Central Standard Time (WITA)
                </SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Australia & Pacific</SelectLabel>
                <SelectItem value="awst">
                  Australian Western Standard Time (AWST)
                </SelectItem>
                <SelectItem value="acst">
                  Australian Central Standard Time (ACST)
                </SelectItem>
                <SelectItem value="aest">
                  Australian Eastern Standard Time (AEST)
                </SelectItem>
                <SelectItem value="nzst">
                  New Zealand Standard Time (NZST)
                </SelectItem>
                <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>South America</SelectLabel>
                <SelectItem value="art">Argentina Time (ART)</SelectItem>
                <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  );
}
