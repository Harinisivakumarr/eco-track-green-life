
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FootprintFormData, FootprintResult, DietType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { calculateFootprint, getMockFootprintResult } from "@/lib/api";
import { Progress } from "@/components/ui/progress";

const Calculator: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState("home");
  const [footprintResult, setFootprintResult] = useState<FootprintResult | null>(null);
  const [formData, setFormData] = useState<FootprintFormData>({
    electricity: 250,
    naturalGas: 80,
    heating: 0,
    carMiles: 500,
    publicTransportMiles: 100,
    flights: {
      shortHaul: 0,
      mediumHaul: 0,
      longHaul: 0
    },
    diet: "average",
    wasteRecycling: 50
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | 
    { target: { name: string; value: string | number } }
  ) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof FootprintFormData] as any,
          [child]: Number(value)
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === "diet" ? value : Number(value)
      });
    }
  };

  const handleSliderChange = (name: string, value: number[] | number) => {
    const singleValue = Array.isArray(value) ? value[0] : value;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof FootprintFormData] as any,
          [child]: singleValue
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: singleValue
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // For now, use mock data - replace with real API call when backend is ready
      // const result = await calculateFootprint(formData);
      const result = getMockFootprintResult();
      
      // Simulate API delay
      setTimeout(() => {
        setFootprintResult(result);
        toast({
          title: "Carbon footprint calculated",
          description: "Your carbon footprint result is ready to view."
        });
      }, 1500);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Calculation failed",
        description: "There was an error calculating your carbon footprint."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFootprintResult(null);
    setStep("home");
  };

  const formatEmissions = (value: number): string => {
    return `${value.toFixed(2)} tons CO₂e`;
  };

  const getEmissionCategory = (value: number): string => {
    if (value < 5) return "Low";
    if (value < 10) return "Moderate";
    if (value < 15) return "High";
    return "Very High";
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Low":
        return "text-green-600";
      case "Moderate":
        return "text-yellow-600";
      case "High":
        return "text-orange-600";
      case "Very High":
        return "text-red-600";
      default:
        return "";
    }
  };

  const getProgressColor = (value: number): string => {
    if (value < 30) return "bg-green-500";
    if (value < 60) return "bg-yellow-500";
    if (value < 80) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Carbon Footprint Calculator</h1>
        <p className="text-muted-foreground mb-6">
          Calculate and understand your personal carbon footprint
        </p>

        {footprintResult ? (
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-green-50 dark:bg-green-900/20">
                <CardTitle>Your Carbon Footprint Result</CardTitle>
                <CardDescription>
                  Based on your input, we've calculated your annual carbon footprint
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Total Result */}
                  <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-card">
                    <h3 className="text-lg font-medium mb-2">Total Annual Emissions</h3>
                    <p className="text-4xl font-bold mb-2">
                      {formatEmissions(footprintResult.totalEmissions)}
                    </p>
                    <div className={`text-lg font-medium ${getCategoryColor(getEmissionCategory(footprintResult.totalEmissions))}`}>
                      {getEmissionCategory(footprintResult.totalEmissions)} Impact
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Emissions Breakdown</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label>Home Energy</Label>
                          <span>{formatEmissions(footprintResult.breakdown.homeEnergy)}</span>
                        </div>
                        <Progress 
                          value={(footprintResult.breakdown.homeEnergy / footprintResult.totalEmissions) * 100} 
                          className={getProgressColor((footprintResult.breakdown.homeEnergy / footprintResult.totalEmissions) * 100)}
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label>Transportation</Label>
                          <span>{formatEmissions(footprintResult.breakdown.transportation)}</span>
                        </div>
                        <Progress 
                          value={(footprintResult.breakdown.transportation / footprintResult.totalEmissions) * 100} 
                          className={getProgressColor((footprintResult.breakdown.transportation / footprintResult.totalEmissions) * 100)}
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label>Flights</Label>
                          <span>{formatEmissions(footprintResult.breakdown.flights)}</span>
                        </div>
                        <Progress 
                          value={(footprintResult.breakdown.flights / footprintResult.totalEmissions) * 100} 
                          className={getProgressColor((footprintResult.breakdown.flights / footprintResult.totalEmissions) * 100)}
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label>Diet</Label>
                          <span>{formatEmissions(footprintResult.breakdown.diet)}</span>
                        </div>
                        <Progress 
                          value={(footprintResult.breakdown.diet / footprintResult.totalEmissions) * 100} 
                          className={getProgressColor((footprintResult.breakdown.diet / footprintResult.totalEmissions) * 100)}
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label>Waste</Label>
                          <span>{formatEmissions(footprintResult.breakdown.waste)}</span>
                        </div>
                        <Progress 
                          value={(footprintResult.breakdown.waste / footprintResult.totalEmissions) * 100} 
                          className={getProgressColor((footprintResult.breakdown.waste / footprintResult.totalEmissions) * 100)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button onClick={resetForm} variant="outline" className="w-full sm:w-auto">
                  Recalculate
                </Button>
                <Button className="w-full sm:w-auto">
                  See Suggestions to Reduce
                </Button>
                <Button variant="secondary" className="w-full sm:w-auto">
                  Save Results
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Tabs value={step} onValueChange={setStep} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="home">Home Energy</TabsTrigger>
                <TabsTrigger value="transportation">Transportation</TabsTrigger>
                <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
              </TabsList>
              
              <TabsContent value="home" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Home Energy Usage</CardTitle>
                    <CardDescription>
                      Enter information about your household energy consumption.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="electricity">Monthly Electricity (kWh)</Label>
                      <div className="flex flex-col gap-2">
                        <Slider
                          id="electricity-slider"
                          min={0}
                          max={1000}
                          step={10}
                          value={[formData.electricity]}
                          onValueChange={(value) => handleSliderChange("electricity", value)}
                          className="my-2"
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">0 kWh</span>
                          <Input
                            type="number"
                            id="electricity"
                            name="electricity"
                            value={formData.electricity}
                            onChange={handleChange}
                            className="w-24 text-right"
                          />
                          <span className="text-sm text-muted-foreground">1000 kWh</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="naturalGas">Monthly Natural Gas (m³)</Label>
                      <div className="flex flex-col gap-2">
                        <Slider
                          id="naturalGas-slider"
                          min={0}
                          max={300}
                          step={5}
                          value={[formData.naturalGas]}
                          onValueChange={(value) => handleSliderChange("naturalGas", value)}
                          className="my-2"
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">0 m³</span>
                          <Input
                            type="number"
                            id="naturalGas"
                            name="naturalGas"
                            value={formData.naturalGas}
                            onChange={handleChange}
                            className="w-24 text-right"
                          />
                          <span className="text-sm text-muted-foreground">300 m³</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="heating">Other Heating (liters of oil/year)</Label>
                      <div className="flex flex-col gap-2">
                        <Slider
                          id="heating-slider"
                          min={0}
                          max={2000}
                          step={100}
                          value={[formData.heating]}
                          onValueChange={(value) => handleSliderChange("heating", value)}
                          className="my-2"
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">0 L</span>
                          <Input
                            type="number"
                            id="heating"
                            name="heating"
                            value={formData.heating}
                            onChange={handleChange}
                            className="w-24 text-right"
                          />
                          <span className="text-sm text-muted-foreground">2000 L</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="button" onClick={() => setStep("transportation")} className="ml-auto">
                      Next
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="transportation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Transportation</CardTitle>
                    <CardDescription>
                      Enter information about your travel habits.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="carMiles">Monthly Car Miles</Label>
                      <div className="flex flex-col gap-2">
                        <Slider
                          id="carMiles-slider"
                          min={0}
                          max={2000}
                          step={50}
                          value={[formData.carMiles]}
                          onValueChange={(value) => handleSliderChange("carMiles", value)}
                          className="my-2"
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">0 mi</span>
                          <Input
                            type="number"
                            id="carMiles"
                            name="carMiles"
                            value={formData.carMiles}
                            onChange={handleChange}
                            className="w-24 text-right"
                          />
                          <span className="text-sm text-muted-foreground">2000 mi</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="publicTransportMiles">Monthly Public Transport Miles</Label>
                      <div className="flex flex-col gap-2">
                        <Slider
                          id="publicTransportMiles-slider"
                          min={0}
                          max={1000}
                          step={25}
                          value={[formData.publicTransportMiles]}
                          onValueChange={(value) => handleSliderChange("publicTransportMiles", value)}
                          className="my-2"
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">0 mi</span>
                          <Input
                            type="number"
                            id="publicTransportMiles"
                            name="publicTransportMiles"
                            value={formData.publicTransportMiles}
                            onChange={handleChange}
                            className="w-24 text-right"
                          />
                          <span className="text-sm text-muted-foreground">1000 mi</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Annual Flights</Label>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <Label htmlFor="flights.shortHaul" className="text-sm">Short Haul (<3 hrs)</Label>
                          <Input
                            type="number"
                            id="flights.shortHaul"
                            name="flights.shortHaul"
                            value={formData.flights.shortHaul}
                            onChange={handleChange}
                            className="mt-1"
                            min="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="flights.mediumHaul" className="text-sm">Medium Haul (3-6 hrs)</Label>
                          <Input
                            type="number"
                            id="flights.mediumHaul"
                            name="flights.mediumHaul"
                            value={formData.flights.mediumHaul}
                            onChange={handleChange}
                            className="mt-1"
                            min="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="flights.longHaul" className="text-sm">Long Haul (>6 hrs)</Label>
                          <Input
                            type="number"
                            id="flights.longHaul"
                            name="flights.longHaul"
                            value={formData.flights.longHaul}
                            onChange={handleChange}
                            className="mt-1"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep("home")}>
                      Back
                    </Button>
                    <Button type="button" onClick={() => setStep("lifestyle")}>
                      Next
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="lifestyle" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Lifestyle & Diet</CardTitle>
                    <CardDescription>
                      Enter information about your diet and waste habits.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="diet">Diet Type</Label>
                      <Select
                        value={formData.diet}
                        onValueChange={(value) => handleChange({ target: { name: "diet", value } })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your diet type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Diet Type</SelectLabel>
                            <SelectItem value="meat-heavy">Meat Heavy</SelectItem>
                            <SelectItem value="average">Average (Mixed)</SelectItem>
                            <SelectItem value="vegetarian">Vegetarian</SelectItem>
                            <SelectItem value="vegan">Vegan</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="wasteRecycling">Recycling Percentage</Label>
                      <div className="flex flex-col gap-2">
                        <Slider
                          id="wasteRecycling-slider"
                          min={0}
                          max={100}
                          step={5}
                          value={[formData.wasteRecycling]}
                          onValueChange={(value) => handleSliderChange("wasteRecycling", value)}
                          className="my-2"
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">0%</span>
                          <span className="text-sm font-medium">{formData.wasteRecycling}%</span>
                          <span className="text-sm text-muted-foreground">100%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep("transportation")}>
                      Back
                    </Button>
                    <Button type="submit" className="bg-eco-primary hover:bg-eco-secondary" disabled={isLoading}>
                      {isLoading ? "Calculating..." : "Calculate Footprint"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        )}
      </div>
    </AppLayout>
  );
};

export default Calculator;
