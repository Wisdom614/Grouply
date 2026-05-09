"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Container } from "@/components/shared/Container";
import { CheckCircle2, AlertCircle, Upload, X } from "lucide-react";

// Form validation schema
const groupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name is too long"),
  description: z.string().min(20, "Description must be at least 20 characters").max(500, "Description is too long"),
  platform: z.enum(["discord", "whatsapp", "telegram", "other"], {
    required_error: "Please select a platform",
  }),
  platformUrl: z.string().url("Please enter a valid URL").startsWith("https", "URL must start with https"),
  tags: z.string().min(1, "Add at least one tag"),
  memberCount: z.number().min(0).max(1000000).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  authorName: z.string().min(2, "Please enter your name"),
  authorEmail: z.string().email("Please enter a valid email"),
});

type GroupFormData = z.infer<typeof groupSchema>;

const platformOptions = [
  { value: "discord", label: "Discord", icon: "🎮", color: "bg-indigo-100 text-indigo-700" },
  { value: "whatsapp", label: "WhatsApp", icon: "💬", color: "bg-green-100 text-green-700" },
  { value: "telegram", label: "Telegram", icon: "✈️", color: "bg-sky-100 text-sky-700" },
  { value: "other", label: "Other", icon: "🌐", color: "bg-gray-100 text-gray-700" },
];

const suggestionTags = [
  "programming", "gaming", "business", "prayer", "crypto", "students",
  "anime", "music", "art", "sports", "cooking", "travel", "tech", "design"
];

export default function AddGroupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      platform: "discord",
      memberCount: 0,
    },
  });

  const selectedPlatform = watch("platform");

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      const newTags = [...tags, tagInput.trim().toLowerCase()];
      setTags(newTags);
      setValue("tags", newTags.join(","));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter(t => t !== tag);
    setTags(newTags);
    setValue("tags", newTags.join(","));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setValue("imageUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: GroupFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          tags: tags,
          authorId: `pending-${Date.now()}`,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        reset();
        setTags([]);
        setImagePreview(null);
        setTimeout(() => {
          router.push("/?success=group-added");
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-24">
        <Container className="max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Add Your Community
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share your community with thousands of people looking to connect.
            </p>
          </div>

          {submitStatus === "success" && (
            <Card className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
              <CardContent className="p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-300">Community submitted successfully!</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Redirecting you back...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {submitStatus === "error" && (
            <Card className="mb-6 border-red-500 bg-red-50 dark:bg-red-950">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-semibold text-red-700 dark:text-red-300">Submission failed</p>
                  <p className="text-sm text-red-600 dark:text-red-400">Please try again or contact support.</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Community Information</CardTitle>
              <CardDescription>
                Fill out the details below to add your community to Grouply.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Community Name */}
                <div>
                  <Label htmlFor="name">Community Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Python Cameroon"
                    {...register("name")}
                    className="mt-1.5"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your community, what it's about, who it's for..."
                    className="mt-1.5 min-h-[120px]"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                  )}
                </div>

                {/* Platform */}
                <div>
                  <Label htmlFor="platform">Platform *</Label>
                  <Select
                    onValueChange={(value) => setValue("platform", value as any)}
                    defaultValue="discord"
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platformOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex items-center gap-2">
                            <span>{option.icon}</span> {option.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.platform && (
                    <p className="text-sm text-red-500 mt-1">{errors.platform.message}</p>
                  )}
                </div>

                {/* Platform URL */}
                <div>
                  <Label htmlFor="platformUrl">Invite Link / Join URL *</Label>
                  <Input
                    id="platformUrl"
                    placeholder="https://discord.gg/invite or https://chat.whatsapp.com/..."
                    {...register("platformUrl")}
                    className="mt-1.5"
                  />
                  {errors.platformUrl && (
                    <p className="text-sm text-red-500 mt-1">{errors.platformUrl.message}</p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags">Tags *</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      id="tags"
                      placeholder="Add tags (e.g., programming, students)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  
                  {/* Tag suggestions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {suggestionTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (!tags.includes(tag)) {
                            const newTags = [...tags, tag];
                            setTags(newTags);
                            setValue("tags", newTags.join(","));
                          }
                        }}
                        className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900 transition"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                  
                  {/* Display added tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-purple-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {errors.tags && (
                    <p className="text-sm text-red-500 mt-1">{errors.tags.message}</p>
                  )}
                </div>

                {/* Member Count */}
                <div>
                  <Label htmlFor="memberCount">Approximate Member Count</Label>
                  <Input
                    id="memberCount"
                    type="number"
                    placeholder="e.g., 1500"
                    {...register("memberCount", { valueAsNumber: true })}
                    className="mt-1.5"
                  />
                </div>

                {/* Community Image */}
                <div>
                  <Label>Community Image / Logo (Optional)</Label>
                  <div className="mt-1.5">
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-24 h-24 rounded-xl object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setValue("imageUrl", "");
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-purple-500 transition">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Your Information */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Your Information</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="authorName">Your Name *</Label>
                      <Input
                        id="authorName"
                        placeholder="e.g., John Doe"
                        {...register("authorName")}
                        className="mt-1.5"
                      />
                      {errors.authorName && (
                        <p className="text-sm text-red-500 mt-1">{errors.authorName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="authorEmail">Your Email *</Label>
                      <Input
                        id="authorEmail"
                        type="email"
                        placeholder="john@example.com"
                        {...register("authorEmail")}
                        className="mt-1.5"
                      />
                      {errors.authorEmail && (
                        <p className="text-sm text-red-500 mt-1">{errors.authorEmail.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Community"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </Container>
      </main>
      <BottomNav />
    </>
  );
}