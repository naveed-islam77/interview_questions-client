"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { categoryApi } from "@/lib/api/categories";
import { questionApi } from "@/lib/api/questions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalCategories: number;
  totalQuestions: number;
  recentCategories: Array<{
    _id: string;
    category: string;
    questionCount: number;
  }>;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [categoriesResponse, questionsResponse] = await Promise.all([
          categoryApi.getAll(),
          questionApi.getAll(),
        ]);

        const categories = categoriesResponse;
        const questions = questionsResponse;

        setStats({
          totalCategories: categories.length,
          totalQuestions: questions.length,
          recentCategories: categories.slice(0, 5),
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your interview questions and categories
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalCategories || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Questions
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalQuestions || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Questions/Category
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalCategories
                ? Math.round(
                    (stats.totalQuestions / stats.totalCategories) * 10
                  ) / 10
                : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button asChild size="sm" className="w-full">
              <Link href="/categories/create">New Category</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentCategories.map((category) => (
              <div
                key={category._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{category.category}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.questionCount} questions
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{category.questionCount}</Badge>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/categories/${category._id}`}>View</Link>
                  </Button>
                </div>
              </div>
            ))}
            {(!stats?.recentCategories ||
              stats.recentCategories.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  No categories yet. Create your first category to get started!
                </p>
                <Button asChild className="mt-4">
                  <Link href="/categories/create">Create Category</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
