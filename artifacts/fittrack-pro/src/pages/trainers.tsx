import { useState } from "react";
import {
  useListTrainers,
  useBookTrainer,
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  Clock,
  Video,
  CalendarCheck,
  CheckCircle,
  Users,
} from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const VIDEO_SESSIONS = [
  {
    id: 1,
    title: "45-Min Full Body HIIT",
    trainer: "Coach Marcus Webb",
    duration: "45 min",
    level: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400&q=80",
  },
  {
    id: 2,
    title: "Morning Yoga Flow",
    trainer: "Sarah Chen",
    duration: "30 min",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
  },
  {
    id: 3,
    title: "Strength Foundations",
    trainer: "Derek Thompson",
    duration: "60 min",
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
  },
];

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-green-500/10 text-green-400 border-green-500/30",
  Intermediate: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Advanced: "bg-orange-500/10 text-orange-400 border-orange-500/30",
};

export default function Trainers() {
  const { data: trainers, isLoading } = useListTrainers();
  const bookTrainer = useBookTrainer();
  const [selectedTrainer, setSelectedTrainer] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ clientName: "", date: "", time: "", notes: "" });

  const handleBook = () => {
    if (!selectedTrainer || !form.clientName || !form.date || !form.time) return;
    bookTrainer.mutate(
      { id: selectedTrainer, data: form },
      {
        onSuccess: () => {
          setSuccess(true);
          setForm({ clientName: "", date: "", time: "", notes: "" });
        },
      }
    );
  };

  const openBooking = (trainerId: number) => {
    setSelectedTrainer(trainerId);
    setSuccess(false);
    setOpen(true);
  };

  const selectedTrainerData = (trainers ?? []).find((t) => t.id === selectedTrainer);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">TRAINERS</h1>
        <p className="text-muted-foreground mt-1">Expert coaches to accelerate your results</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Expert Trainers", value: (trainers ?? []).length, icon: Users },
          { label: "Video Sessions", value: VIDEO_SESSIONS.length, icon: Video },
          { label: "Available Now", value: (trainers ?? []).filter((t) => t.available).length, icon: CheckCircle },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="bg-card border-border">
            <CardContent className="p-5 flex items-center gap-3">
              <Icon className="h-6 w-6 text-primary" />
              <div>
                <div className="text-xl font-bold font-display">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trainer Profiles */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {(trainers ?? []).map((trainer) => (
            <Card
              key={trainer.id}
              className="bg-card border-border hover:border-primary/30 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-16 w-16 shrink-0">
                    <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                      {getInitials(trainer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{trainer.name}</h3>
                        <p className="text-sm text-primary">{trainer.specialty}</p>
                      </div>
                      {trainer.available ? (
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/30 text-xs shrink-0">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground shrink-0">
                          Busy
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{trainer.rating}</span>
                        <span className="text-muted-foreground">({trainer.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>${trainer.hourlyRate}/hr</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{trainer.bio}</p>
                <Button
                  className="w-full gap-2"
                  onClick={() => openBooking(trainer.id)}
                  disabled={!trainer.available}
                  variant={trainer.available ? "default" : "outline"}
                >
                  <CalendarCheck className="h-4 w-4" />
                  {trainer.available ? "Book Consultation" : "Currently Unavailable"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Video Sessions */}
      <div>
        <h2 className="text-xl font-bold font-display mb-4">VIDEO WORKOUT SESSIONS</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {VIDEO_SESSIONS.map((session) => (
            <Card key={session.id} className="bg-card border-border overflow-hidden group">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={session.thumbnail}
                  alt={session.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center backdrop-blur-sm group-hover:bg-primary/40 transition-colors">
                    <Video className="h-5 w-5 text-primary ml-0.5" />
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`absolute top-3 right-3 text-xs ${LEVEL_COLORS[session.level]}`}
                >
                  {session.level}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold mb-1">{session.title}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{session.trainer}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {session.duration}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3 gap-2">
                  <Video className="h-3.5 w-3.5" /> Watch Session
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSuccess(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Book with {selectedTrainerData?.name ?? "Trainer"}
            </DialogTitle>
          </DialogHeader>
          {success ? (
            <div className="py-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground text-sm">
                Your session has been booked. Check your email for confirmation details.
              </p>
              <Button className="mt-6 w-full" onClick={() => setOpen(false)}>Done</Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label>Your Name</Label>
                <Input
                  placeholder="Full name"
                  value={form.clientName}
                  onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Notes (optional)</Label>
                <Textarea
                  placeholder="Goals, injuries, preferences..."
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                />
              </div>
              <Button onClick={handleBook} className="w-full" disabled={bookTrainer.isPending}>
                {bookTrainer.isPending ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
