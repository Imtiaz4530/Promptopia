import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate("creator");

    if (!prompt)
      return new Response(JSON.stringify("Prompts not found."), {
        status: 404,
      });

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify("Failed to fetch prompts"), {
      status: 500,
    });
  }
};

export const Patch = async (req, { params }) => {
  const { prompt, tag } = await req.json();

  try {
    await connectToDB();

    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt)
      return new Response(JSON.stringify("Prompts not found."), {
        status: 404,
      });

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();
    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify("Failed to update prompt."), {
      status: 500,
    });
  }
};

export const Delete = async (req, { params }) => {
  try {
    await connectToDB();

    await Prompt.findByIdAndDelete(params.id);

    return new Response(JSON.stringify("Prompt deleted."), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify("Failed to delete prompt."), {
      status: 500,
    });
  }
};
