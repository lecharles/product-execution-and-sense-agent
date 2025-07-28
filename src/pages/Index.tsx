import React, { useState } from 'react';
import { InterviewChat } from '@/components/InterviewChat';
import { SettingsDialog } from '@/components/SettingsDialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Target, BarChart3, Users, Github, Settings } from 'lucide-react';

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary/20 bg-gradient-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">PM Interview Coach</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Practice Platform</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSettingsOpen(true)}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">API Key</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('https://github.com', '_blank')}
                className="gap-2"
              >
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2">
            <InterviewChat onOpenSettings={() => setSettingsOpen(true)} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features */}
            <Card className="p-6 bg-gradient-card border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Features
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Product Execution</p>
                    <p className="text-xs text-muted-foreground">Practice design and improvement questions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Product Sense</p>
                    <p className="text-xs text-muted-foreground">Develop intuition for product decisions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Real-time Feedback</p>
                    <p className="text-xs text-muted-foreground">Get instant evaluation and tips</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 bg-gradient-card border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Interview Tips
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="font-medium mb-1">Structure Your Answers</p>
                  <p className="text-muted-foreground text-xs">Use frameworks like CIRCLES or RICE</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="font-medium mb-1">Ask Clarifying Questions</p>
                  <p className="text-muted-foreground text-xs">Understand the problem deeply first</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="font-medium mb-1">Think About Metrics</p>
                  <p className="text-muted-foreground text-xs">Always consider how to measure success</p>
                </div>
              </div>
            </Card>

            {/* About */}
            <Card className="p-6 bg-gradient-card border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                About
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Practice PM interviews with our AI coach. Get personalized feedback 
                and improve your product thinking skills for top tech companies.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setSettingsOpen(true)}
              >
                Configure API Key
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <SettingsDialog 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen} 
      />
    </div>
  );
};

export default Index;