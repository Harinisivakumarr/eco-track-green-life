
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleEmailAuth = async (type: "signin" | "signup") => {
    setLoading(true);
    try {
      if (type === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      // Toast is already handled in the AuthContext
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      // Toast is already handled in the AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center">
            <Leaf className="h-8 w-8 text-eco-primary mr-2" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EcoFootprint</h1>
          </div>
          <nav>
            <Button variant="ghost" className="mr-2">About</Button>
            <Button variant="ghost" className="mr-2">Features</Button>
            <Button variant="ghost">Contact</Button>
          </nav>
        </header>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Track Your Carbon Footprint, <span className="text-eco-primary">Save the Planet</span>
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 mb-8">
              Join thousands of eco-conscious individuals in reducing their environmental impact. 
              Calculate, track, and improve your carbon footprint with our easy-to-use tools.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => document.getElementById("auth-card")?.scrollIntoView({ behavior: "smooth" })}>
                Get Started
              </Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
          
          <div id="auth-card">
            <Card className="border-t-4 border-t-eco-primary shadow-lg">
              <CardHeader>
                <CardTitle>Join EcoFootprint</CardTitle>
                <CardDescription>Calculate and track your carbon footprint.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  <TabsContent value="signin">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <Input 
                          id="signin-email" 
                          type="email" 
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password">Password</Label>
                        <Input 
                          id="signin-password" 
                          type="password" 
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={loading}
                          required 
                        />
                      </div>
                      <Button 
                        className="w-full mt-2" 
                        disabled={loading}
                        onClick={() => handleEmailAuth("signin")}
                      >
                        {loading ? "Signing In..." : "Sign In"}
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="signup">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input 
                          id="signup-password" 
                          type="password" 
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={loading}
                          required 
                        />
                      </div>
                      <Button 
                        className="w-full mt-2" 
                        disabled={loading}
                        onClick={() => handleEmailAuth("signup")}
                      >
                        {loading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleAuth}
                  disabled={loading}
                >
                  Continue with Google
                </Button>
              </CardContent>
              <CardFooter className="flex justify-center text-xs text-muted-foreground">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold mb-12">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg bg-card shadow-sm">
              <div className="w-12 h-12 bg-eco-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-eco-primary text-xl font-bold">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Calculate</h4>
              <p className="text-muted-foreground">
                Answer simple questions about your lifestyle to calculate your carbon footprint.
              </p>
            </div>
            <div className="p-6 border rounded-lg bg-card shadow-sm">
              <div className="w-12 h-12 bg-eco-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-eco-primary text-xl font-bold">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Track</h4>
              <p className="text-muted-foreground">
                Monitor your progress over time and see how your actions impact your footprint.
              </p>
            </div>
            <div className="p-6 border rounded-lg bg-card shadow-sm">
              <div className="w-12 h-12 bg-eco-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-eco-primary text-xl font-bold">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Improve</h4>
              <p className="text-muted-foreground">
                Get personalized suggestions to reduce your environmental impact.
              </p>
            </div>
          </div>
        </div>
        
        <footer className="mt-24 py-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EcoFootprint - Track your carbon footprint</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
