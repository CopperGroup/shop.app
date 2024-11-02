"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const CreatePixel = () => {
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

    return (
        <>
            {!isFormOpen ? (
                <Button 
                  onClick={() => setIsFormOpen(true)} 
                  className="w-full text-small-medium h-8"
                  variant="outline"
                >
                  <Plus className="mr-2 h-3 w-3" /> Add Facebook Pixel
                </Button>
            ) : (
                <Card className="mt-4 border border-muted shadow-sm">
                  <CardContent className="pt-4">
                    <form className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="pixel_name" className="text-small-semibold text-muted-foreground">Pixel Name</Label>
                        <Input
                          id="pixel_name"
                          placeholder="Enter pixel name"
                          className="text-small-regular h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="pixel_id" className="text-small-semibold text-muted-foreground">Pixel ID</Label>
                        <Input
                          id="pixel_id"
                          placeholder="Enter pixel ID"
                          className="text-small-regular h-8"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button type="submit" className="text-small-medium text-white flex-1 h-8">Connect</Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => setIsFormOpen(false)} 
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
            )}
        </>
    )
}

export default CreatePixel