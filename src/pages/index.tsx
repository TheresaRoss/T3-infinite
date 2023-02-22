import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect } from "react";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "~/utils/api";

interface User {
  id: String;
  name: String;
  age: Number;
  stupidity?: String;
}

const Home: NextPage = () => {
  const validateForm = z.object({
    name: z.string().min(1, { message: "Require name!" }),
    age: z
      .number({ required_error: "Age is required" })
      .min(0, { message: "For real ?!" })
      .max(99, { message: "For real ?!" }),
    stupidity: z.string().optional(),
  });
  type Validate = z.infer<typeof validateForm>;
  const bobo = api.user.create.useMutation();

  const [results, setResult] = useState([]);

  const [page, setPage] = useState(0);

  const { data, fetchNextPage } = api.user.getall.useInfiniteQuery(
    {
      limit: 4,
      userId: "",
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const handleFetchNextPage = () => {
    fetchNextPage();
    setPage((prev) => prev + 1);
    console.log(page === 0);
  };

  const handleFetchPreviousPage = () => {
    setPage((prev) => prev - 1);
  };

  const toShow = data?.pages[page]?.items;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Validate>({ resolver: zodResolver(validateForm) });

  const onSubmit: SubmitHandler<Validate> = (data) => {
    console.log("hihihihi   .....", toShow);

    bobo.mutate(data);
    //alert(JSON.stringify(bobo));
  };

  return (
    <>
      <div className="flex justify-center bg-red-300 text-5xl">YOMAN</div>
      <div className="mx-16 flex justify-center bg-gradient-to-r from-lime-200 via-yellow-200 to-cyan-200 py-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Name:</label>
            <input
              className="w-full bg-cyan-200 focus:ring-sky-400"
              id="name"
              placeholder="Jesus"
              type="text"
              {...register("name")}
            ></input>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name?.message}</p>
            )}
          </div>
          <div>
            <label>Age:</label>
            <input
              className="w-full bg-cyan-200 focus:ring-sky-400"
              id="age"
              placeholder="5"
              type="number"
              {...register("age", { valueAsNumber: true })}
            ></input>
            {errors.age && (
              <p className="text-sm text-red-500">{errors.age?.message}</p>
            )}
          </div>
          <div>
            <label>Stupidity:</label>
            <input
              className="w-full bg-cyan-200 focus:ring-sky-400"
              id="stupidity"
              placeholder="hahaha"
              type="text"
              {...register("stupidity")}
            ></input>
            <div className="mt-4 flex justify-center">
              <button
                type="submit"
                className="flex justify-center rounded-xl bg-blue-800 px-5 py-2 text-white"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className=" ">
        <div className="flex justify-center">
          <div className="mt-5 w-[50%] bg-white">
            {toShow?.map((user) => {
              return (
                <div
                  className="mb-4 w-full rounded-full bg-sky-200  py-2 px-5"
                  key={user.id}
                >
                  <p>Name: {user.name}</p>
                  <p>Age: {user.age}</p>
                  <p>Stupidity: {user?.stupidity}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative left-[10%] mb-20 flex w-[80%] justify-center ">
          <div
            className={
              page === 0
                ? "invisible"
                : "visible mr-16 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white"
            }
            onClick={() => {
              handleFetchPreviousPage();
            }}
          >
            {"<-"}
          </div>
          <div
            onClick={() => {
              handleFetchNextPage();
            }}
            className="ml-16 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white"
          >
            {"->"}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
