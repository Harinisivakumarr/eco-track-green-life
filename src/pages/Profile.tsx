
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { EcoAction } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateProfile } from "firebase/auth";

const mockActions: EcoAction[] = [
  {
    id: '1',
    userId: 'user1',
    type: 'energy-saving',
    points: 10,
    emissionsSaved: 2.5,
    date: new Date(),
    description: 'Reduced home electricity usage by 15%'
  },
  {
    id: '2',
    userId: 'user1',
    type: 'sustainable-transport',
    points: 15,
    emissionsSaved: 5,
    date: new Date(Date.now() - 86400000),
    description: 'Took public transportation instead of driving'
  },
  {
    id: '3',
    userId: 'user1',
    type: 'diet-change',
    points: 20,
    emissionsSaved: 8,
    date: new Date(Date.now() - 86400000 * 2),
    description: 'Followed a plant-based diet for a week'
  },
  {
    id: '4',
    userId: 'user1',
    type: 'waste-reduction',
    points: 5,
    emissionsSaved: 1,
    date: new Date(Date.now() - 86400000 * 3),
    description: 'Used reusable containers instead of disposable ones'
  }
];

const ActionTypeColors: Record<string, string> = {
  'energy-saving': 'bg-yellow-100 text-yellow-800',
  'sustainable-transport': 'bg-blue-100 text-blue-800',
  'diet-change': 'bg-green-100 text-green-800',
  'waste-reduction': 'bg-purple-100 text-purple-800',
  'water-saving': 'bg-cyan-100 text-cyan-800',
  'other': 'bg-gray-100 text-gray-800'
};

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || "");
  const [isLoading, setIsLoading] = useState(false);
  const [ecoActions, setEcoActions] = useState<EcoAction[]>(mockActions);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsLoading(true);
    
    try {
      await updateProfile(currentUser, {
        displayName,
        photoURL
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was a problem updating your profile."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and view your eco activity
        </p>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="activity">Eco Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account information and profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col items-center">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={photoURL || undefined} />
                          <AvatarFallback className="text-lg">
                            {currentUser?.displayName 
                              ? getInitials(currentUser.displayName)
                              : currentUser?.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          disabled
                          value={currentUser?.email || ""}
                        />
                        <p className="text-xs text-muted-foreground">
                          Email addresses cannot be changed
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="photoURL">Profile Picture URL</Label>
                        <Input
                          id="photoURL"
                          value={photoURL}
                          onChange={(e) => setPhotoURL(e.target.value)}
                          placeholder="https://example.com/photo.jpg"
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter a URL to an image for your profile picture
                        </p>
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Profile"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-muted-foreground">Account Created</Label>
                    <p className="font-medium">
                      {currentUser?.metadata?.creationTime 
                        ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                        : "Not available"}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-muted-foreground">Last Sign In</Label>
                    <p className="font-medium">
                      {currentUser?.metadata?.lastSignInTime
                        ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString()
                        : "Not available"}
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-2">Carbon Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted p-4 rounded-md">
                        <p className="text-sm text-muted-foreground">Total Carbon Saved</p>
                        <p className="text-2xl font-bold">450 kg</p>
                      </div>
                      <div className="bg-muted p-4 rounded-md">
                        <p className="text-sm text-muted-foreground">Green Points</p>
                        <p className="text-2xl font-bold">320</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Download Your Data
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Your Eco Activity History</CardTitle>
                <CardDescription>
                  Track your eco-friendly actions and their impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {ecoActions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2">Date</th>
                            <th className="text-left py-3 px-2">Action</th>
                            <th className="text-left py-3 px-2">Type</th>
                            <th className="text-right py-3 px-2">Points</th>
                            <th className="text-right py-3 px-2">CO2 Saved</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ecoActions.map((action) => (
                            <tr key={action.id} className="border-b">
                              <td className="py-3 px-2">{formatDate(action.date)}</td>
                              <td className="py-3 px-2">{action.description}</td>
                              <td className="py-3 px-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${ActionTypeColors[action.type]}`}>
                                  {action.type.replace('-', ' ')}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-right font-medium">+{action.points}</td>
                              <td className="py-3 px-2 text-right">{action.emissionsSaved} kg</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-lg font-medium mb-2">No eco actions yet</p>
                      <p className="text-muted-foreground mb-4">
                        Start taking eco-friendly actions to build your history
                      </p>
                      <Button>Get Suggestions</Button>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex flex-col w-full">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-muted p-3 rounded-md text-center">
                      <p className="text-sm text-muted-foreground">Total Actions</p>
                      <p className="text-xl font-bold">{ecoActions.length}</p>
                    </div>
                    <div className="bg-muted p-3 rounded-md text-center">
                      <p className="text-sm text-muted-foreground">Total Points</p>
                      <p className="text-xl font-bold">
                        {ecoActions.reduce((sum, action) => sum + action.points, 0)}
                      </p>
                    </div>
                    <div className="bg-muted p-3 rounded-md text-center">
                      <p className="text-sm text-muted-foreground">CO2 Saved</p>
                      <p className="text-xl font-bold">
                        {ecoActions.reduce((sum, action) => sum + action.emissionsSaved, 0)} kg
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Log New Eco Action
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Profile;
