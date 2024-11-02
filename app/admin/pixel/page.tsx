import CreatePixel from "@/components/forms/CreatePixel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Facebook, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PixelData {
  pixel_type: string;
  pixel_name: string;
  pixel_id: string;
}

const Page = () => {
    const pixels: any[] = [];

    return (
        <section className="w-full px-10 py-20 max-[360px]:px-4">
          <div className="w-full">
            <Card className="max-w-96 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-heading4-medium">Facebook Pixels</CardTitle>
                <CardDescription className="text-small-regular text-muted-foreground">Manage your tracking pixels</CardDescription>
              </CardHeader>
              <CardContent>
                {pixels.length === 0 ? (
                  <Alert variant="default" className="mb-4 bg-muted/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-base-medium">No pixels connected</AlertTitle>
                    <AlertDescription className="text-small-regular">
                      Add your first pixel to start tracking.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <ScrollArea className="h-[180px] w-full rounded-md border border-muted p-2 mb-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-muted">
                          <th className="text-left p-2 text-small-semibold text-muted-foreground">Name</th>
                          <th className="text-left p-2 text-small-semibold text-muted-foreground">ID</th>
                          <th className="text-right p-2 text-small-semibold text-muted-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pixels.map((pixel, index) => (
                          <tr key={index} className="border-b border-muted last:border-b-0">
                            <td className="p-2 flex items-center text-small-regular">
                              <Facebook className="mr-2 h-3 w-3 text-blue-600" />
                              {pixel.pixel_name}
                            </td>
                            <td className="p-2 text-small-regular">{pixel.pixel_id}</td>
                            <td className="p-2 text-right">
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>
                )}
                <CreatePixel />
              </CardContent>
            </Card>
          </div>
        </section>
    )
}

export default Page