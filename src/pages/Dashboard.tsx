
import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowUp, ArrowDown, TrendingUp, TrendingDown, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProgress, getDailyTip, getMockProgress, getMockDailyTip } from "@/lib/api";
import { Badge, DailyTip } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any>(null);
  const [dailyTip, setDailyTip] = useState<DailyTip | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For now, we'll use mock data until backend is ready
        // When backend is ready:
        // const progressData = await getUserProgress(currentUser.uid);
        // const tipData = await getDailyTip();
        
        const progressData = getMockProgress();
        const tipData = getMockDailyTip();
        
        setProgress(progressData);
        setDailyTip(tipData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border shadow-sm rounded-md">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-eco-primary">{`CO2: ${payload[0].value} tons`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Welcome back, {currentUser?.displayName || "Eco Hero"}</h1>
          <p className="text-muted-foreground">Here's a summary of your carbon footprint journey.</p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Carbon Emission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">10.5 tons</div>
                <div className="flex items-center text-sm font-medium text-emerald-600">
                  <ArrowDown className="mr-1 h-4 w-4" />
                  12.3%
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Compared to last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Carbon Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                  {loading ? "Loading..." : `${progress?.carbonSaved || 0} kg`}
                </div>
                <div className="flex items-center text-sm font-medium text-emerald-600">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  24.5%
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Since you started tracking
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Green Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">
                  {loading ? "Loading..." : progress?.greenPoints || 0}
                </div>
                <div className="flex items-center text-sm font-medium text-emerald-600">
                  <Award className="mr-1 h-4 w-4" />
                  3 badges
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Earn more points with eco-friendly actions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Tip Section */}
        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-5">
            <CardHeader>
              <CardTitle>Your Carbon Footprint Over Time</CardTitle>
              <CardDescription>
                Track your emissions reduction progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading chart data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={progress?.monthlyProgress || []}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis 
                        name="CO2" 
                        unit=" tons" 
                        domain={['dataMin - 1', 'dataMax + 1']} 
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="emissions"
                        stroke="#3B755F"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="bg-eco-primary text-primary-foreground rounded-t-md">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                <CardTitle className="text-lg">Eco Tip of the Day</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <p>Loading eco tip...</p>
              ) : (
                <>
                  <h4 className="font-semibold text-lg mb-2">{dailyTip?.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{dailyTip?.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="eco-badge bg-eco-light text-eco-primary">
                      {dailyTip?.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {dailyTip?.difficultyLevel} difficulty
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Badges */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {loading ? (
              <p>Loading badges...</p>
            ) : progress?.badges?.length > 0 ? (
              progress.badges.map((badge: Badge) => (
                <Card key={badge.id} className="overflow-hidden">
                  <div className="bg-eco-light p-6 flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-eco-primary/20 flex items-center justify-center">
                      <Award className="h-8 w-8 text-eco-primary" />
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-center">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      {badge.description}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">No badges yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete eco-friendly actions to earn badges and points
                  </p>
                  <Button onClick={() => navigate("/suggestions")}>
                    Get Started with Eco Actions
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="pb-10">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              className={cn(
                "border-eco-primary text-eco-primary hover:bg-eco-primary hover:text-primary-foreground"
              )}
              onClick={() => navigate("/calculator")}
            >
              Calculate Your Footprint
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/suggestions")}
            >
              Get Eco Suggestions
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/reports")}
            >
              View Reports
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
