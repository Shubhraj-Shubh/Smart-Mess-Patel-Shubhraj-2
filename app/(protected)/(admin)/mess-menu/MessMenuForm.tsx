"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import { CreateMenu } from "@/actions/MessMenuActions";
import { toast } from "sonner";
import { useState } from "react";

// Define the schema for form validation using Zod
const mealTypeSchema = z.object({
  veg: z.array(z.string()).min(1, "Add at least one veg option"),
  nonVeg: z.array(z.string()),
});

const mealSchema = z.object({
  morning: mealTypeSchema,
  lunch: mealTypeSchema,
  eveningSnack: mealTypeSchema,
  dinner: mealTypeSchema,
});

const daySchema = z.object({
  day: z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]),
  meals: mealSchema,
});

const formSchema = z.object({
  season: z.enum(["Summer", "Winter", "Autumn", "Spring"]),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z
    .date({
      required_error: "End date is required",
    })
    .refine((date) => date > new Date(), {
      message: "End date must be in the future",
    }),
  menu: z.array(daySchema).length(7, "Menu for all 7 days is required"),
});

// Define the days of the week
const daysOfWeek: Array<
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday"
> = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
// Define the meal times
const mealTimes: Array<"morning" | "lunch" | "eveningSnack" | "dinner"> = [
  "morning",
  "lunch",
  "eveningSnack",
  "dinner",
];

const mealTimeLabels = {
  morning: "Morning",
  lunch: "Lunch",
  eveningSnack: "Evening Snack",
  dinner: "Dinner",
};

export default function MessMenuForm() {
  const [showForm, setShowForm] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      season: "Spring",
      menu: daysOfWeek.map((day) => ({
        day: day,
        meals: {
          morning: { veg: [""], nonVeg: [""] },
          lunch: { veg: [""], nonVeg: [""] },
          eveningSnack: { veg: [""], nonVeg: [""] },
          dinner: { veg: [""], nonVeg: [""] },
        },
      })),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await CreateMenu(values);

      if (res.status === 200) {
        toast.success("Menu created successfully");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container py-10 mx-auto">
      {showForm ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Mess Menu Configuration</CardTitle>
            <CardDescription>
              Create a seasonal menu for your mess. Configure meals for each day
              of the week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Season Selection */}
                  <FormField
                    control={form.control}
                    name="season"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Season</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select season" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Summer">Summer</SelectItem>
                            <SelectItem value="Winter">Winter</SelectItem>
                            <SelectItem value="Autumn">Autumn</SelectItem>
                            <SelectItem value="Spring">Spring</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the season for this menu.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Start Date */}
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          When this menu starts.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* End Date */}
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>When this menu ends.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Days of the Week Tabs */}
                <Tabs defaultValue="Monday" className="w-full">
                  <TabsList className="grid grid-cols-7 w-full">
                    {daysOfWeek.map((day) => (
                      <TabsTrigger key={day} value={day}>
                        {day}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {daysOfWeek.map((day, dayIndex) => (
                    <TabsContent key={day} value={day} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mealTimes.map((mealTime) => (
                          <Card key={mealTime}>
                            <CardHeader>
                              <CardTitle>
                                {
                                  mealTimeLabels[
                                    mealTime as keyof typeof mealTimeLabels
                                  ]
                                }
                              </CardTitle>
                              <CardDescription>
                                Configure{" "}
                                {mealTimeLabels[
                                  mealTime as keyof typeof mealTimeLabels
                                ].toLowerCase()}{" "}
                                options
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {/* Vegetarian Options */}
                              <div className="space-y-2">
                                <FormLabel>Vegetarian Options</FormLabel>
                                {form
                                  .watch(
                                    `menu.${dayIndex}.meals.${mealTime}.veg`
                                  )
                                  .map((_, vegIndex) => (
                                    <div
                                      key={vegIndex}
                                      className="flex items-center gap-2"
                                    >
                                      <FormField
                                        control={form.control}
                                        name={`menu.${dayIndex}.meals.${mealTime}.veg.${vegIndex}`}
                                        render={({ field }) => (
                                          <FormItem className="flex-1">
                                            <FormControl>
                                              <Input
                                                {...field}
                                                placeholder="Enter veg option"
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                          const currentVeg = form.getValues(
                                            `menu.${dayIndex}.meals.${mealTime}.veg`
                                          );
                                          if (currentVeg.length > 1) {
                                            const newVeg = [...currentVeg];
                                            newVeg.splice(vegIndex, 1);
                                            form.setValue(
                                              `menu.${dayIndex}.meals.${mealTime}.veg`,
                                              newVeg
                                            );
                                          }
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => {
                                    const currentVeg = form.getValues(
                                      `menu.${dayIndex}.meals.${mealTime}.veg`
                                    );
                                    form.setValue(
                                      `menu.${dayIndex}.meals.${mealTime}.veg`,
                                      [...currentVeg, ""]
                                    );
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" /> Add Veg
                                  Option
                                </Button>
                              </div>

                              {/* Non-Vegetarian Options */}
                              <div className="space-y-2">
                                <FormLabel>Non-Vegetarian Options</FormLabel>
                                {form
                                  .watch(
                                    `menu.${dayIndex}.meals.${mealTime}.nonVeg`
                                  )
                                  .map((_, nonVegIndex) => (
                                    <div
                                      key={nonVegIndex}
                                      className="flex items-center gap-2"
                                    >
                                      <FormField
                                        control={form.control}
                                        name={`menu.${dayIndex}.meals.${mealTime}.nonVeg.${nonVegIndex}`}
                                        render={({ field }) => (
                                          <FormItem className="flex-1">
                                            <FormControl>
                                              <Input
                                                {...field}
                                                placeholder="Enter non-veg option"
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                          const currentNonVeg = form.getValues(
                                            `menu.${dayIndex}.meals.${mealTime}.nonVeg`
                                          );
                                          if (currentNonVeg.length > 1) {
                                            const newNonVeg = [
                                              ...currentNonVeg,
                                            ];
                                            newNonVeg.splice(nonVegIndex, 1);
                                            form.setValue(
                                              `menu.${dayIndex}.meals.${mealTime}.nonVeg`,
                                              newNonVeg
                                            );
                                          }
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => {
                                    const currentNonVeg = form.getValues(
                                      `menu.${dayIndex}.meals.${mealTime}.nonVeg`
                                    );
                                    form.setValue(
                                      `menu.${dayIndex}.meals.${mealTime}.nonVeg`,
                                      [...currentNonVeg, ""]
                                    );
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" /> Add Non-Veg
                                  Option
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
                <div className="flex w-full gap-8">
                  <Button
                    className="w-full bg-white text-primary"
                    type="button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" className="w-full hover:text-primary">
                    Submit Menu
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setShowForm(true)}
          className="hover:text-primary"
        >
          Create Menu
        </Button>
      )}
    </div>
  );
}
