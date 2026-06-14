import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListCommunityPosts,
  useCreateCommunityPost,
  useGetLeaderboard,
  getListCommunityPostsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Trophy,
  Heart,
  Plus,
  Footprints,
  Dumbbell,
  Flame,
  Zap,
} from "lucide-react";

const CHALLENGES = [
  {
    id: 1,
    title: "30-Day Step Challenge",
    desc: "Walk 10,000 steps every day for 30 days",
    participants: 247,
    daysLeft: 18,
    icon: Footprints,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    id: 2,
    title: "HIIT Month",
    desc: "Complete 20 HIIT sessions in 30 days",
    participants: 134,
    daysLeft: 12,
    icon: Zap,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    id: 3,
    title: "Strength Summit",
    desc: "Add 5kg to your main lifts this month",
    participants: 89,
    daysLeft: 22,
    icon: Dumbbell,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    id: 4,
    title: "Calorie Burn Blitz",
    desc: "Burn 15,000 calories in one month",
    participants: 193,
    daysLeft: 8,
    icon: Flame,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const RANK_COLORS = ["text-yellow-400", "text-slate-300", "text-amber-600"];

export default function Community() {
  const { data: posts, isLoading: postsLoading } = useListCommunityPosts();
  const { data: leaderboard } = useGetLeaderboard();
  const createPost = useCreateCommunityPost();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ authorName: "", content: "" });

  const handleCreate = () => {
    if (!form.authorName || !form.content) return;
    createPost.mutate(
      { data: form },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListCommunityPostsQueryKey() });
          setForm({ authorName: "", content: "" });
          setOpen(false);
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">COMMUNITY</h1>
          <p className="text-muted-foreground mt-1">Connect, compete, and celebrate together</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Share Update
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Share with the Community</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label>Your Name</Label>
                <Input
                  placeholder="Enter your name"
                  value={form.authorName}
                  onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>What's on your mind?</Label>
                <Textarea
                  placeholder="Share your workout, progress, or motivational message..."
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={4}
                />
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={createPost.isPending}>
                {createPost.isPending ? "Posting..." : "Post Update"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Community Members", value: "2,847", icon: Users, color: "text-primary" },
          { label: "Active Challenges", value: "4", icon: Zap, color: "text-orange-400" },
          { label: "Posts This Week", value: (posts ?? []).length, icon: Heart, color: "text-red-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="bg-card border-border">
            <CardContent className="p-5 flex items-center gap-3">
              <Icon className={`h-7 w-7 ${color}`} />
              <div>
                <div className="text-xl font-bold font-display">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="feed">
        <TabsList>
          <TabsTrigger value="feed">Discussion Feed</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Feed */}
        <TabsContent value="feed" className="space-y-4 mt-6">
          {postsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
            </div>
          ) : (posts ?? []).length === 0 ? (
            <div className="py-16 text-center text-muted-foreground border border-dashed border-border rounded-xl">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">No posts yet</p>
              <p className="text-sm">Be the first to share with the community</p>
            </div>
          ) : (
            (posts ?? []).map((post) => (
              <Card key={post.id} className="bg-card border-border hover:border-border/80 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">
                        {getInitials(post.authorName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{post.authorName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{post.content}</p>
                      <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                        <Heart className="h-3.5 w-3.5 text-red-400" />
                        <span>{post.likes} likes</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Challenges */}
        <TabsContent value="challenges" className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {CHALLENGES.map((challenge) => {
              const Icon = challenge.icon;
              return (
                <Card key={challenge.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${challenge.bg} shrink-0`}>
                        <Icon className={`h-6 w-6 ${challenge.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{challenge.desc}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            <Users className="h-3 w-3 inline mr-1" />
                            {challenge.participants} participants
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {challenge.daysLeft} days left
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      Join Challenge
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-400" /> Top Athletes This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(leaderboard ?? []).map((entry, idx) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                      idx === 0 ? "bg-yellow-500/10 border border-yellow-500/20" :
                      idx === 1 ? "bg-slate-500/10 border border-slate-500/20" :
                      idx === 2 ? "bg-amber-500/10 border border-amber-600/20" :
                      "bg-secondary/20 border border-transparent"
                    }`}
                  >
                    <div className={`text-xl font-bold font-display w-8 text-center ${RANK_COLORS[idx] ?? "text-muted-foreground"}`}>
                      #{entry.rank}
                    </div>
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">
                        {getInitials(entry.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{entry.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {entry.steps.toLocaleString()} steps · {entry.workoutsCompleted} workouts
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`font-bold font-display ${RANK_COLORS[idx] ?? "text-foreground"}`}>
                        {entry.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">pts</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
