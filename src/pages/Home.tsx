
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Home: React.FC = () => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signUp(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-eco-light to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            <Leaf className="h-8 w-8 text-eco-primary mr-2" />
            <h1 className="text-2xl font-bold text-eco-dark">Ecofootprint</h1>
          </div>
        </header>

        <main className="flex flex-col md:flex-row items-center gap-12 py-12">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-eco-dark mb-4">
              Track & Reduce Your Carbon Footprint
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Join thousands taking climate action. Measure your emissions, get personalized
              reduction tips, and track your progress in reducing your environmental impact.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-eco-primary/20 flex items-center justify-center mr-3">
                  <Calculator className="h-5 w-5 text-eco-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Carbon Calculator</h3>
                  <p className="text-sm text-muted-foreground">Track your emissions easily</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-eco-primary/20 flex items-center justify-center mr-3">
                  <Lightbulb className="h-5 w-5 text-eco-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Smart Suggestions</h3>
                  <p className="text-sm text-muted-foreground">Get personalized eco-tips</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-eco-primary/20 flex items-center justify-center mr-3">
                  <Award className="h-5 w-5 text-eco-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Earn Green Points</h3>
                  <p className="text-sm text-muted-foreground">Gamify your eco-journey</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[400px]">
            <Card className="border-0 shadow-lg">
              <Tabs defaultValue="signin">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn}>
                    <CardHeader>
                      <CardTitle>Welcome back</CardTitle>
                      <CardDescription>
                        Sign in to continue tracking your carbon footprint
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Button variant="link" size="sm" className="text-xs p-0 h-auto">
                            Forgot password?
                          </Button>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                      <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                      <div className="relative w-full my-2">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        type="button" 
                        className="w-full"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                      >
                        Google
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp}>
                    <CardHeader>
                      <CardTitle>Create an account</CardTitle>
                      <CardDescription>
                        Start your journey to reduce your carbon footprint
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-email">Email</Label>
                        <Input
                          id="new-email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Password must be at least 6 characters long
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                      <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Create Account"}
                      </Button>
                      <div className="relative w-full my-2">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        type="button" 
                        className="w-full"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                      >
                        Google
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </main>
      </div>

      <footer className="mt-auto py-6 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Leaf className="h-5 w-5 text-eco-primary mr-2" />
              <span className="font-medium">Ecofootprint</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Ecofootprint. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
