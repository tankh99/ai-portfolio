import {pipeline, env, TextClassificationPipeline, PipelineType, ProgressCallback} from "@huggingface/transformers"

env.allowRemoteModels = false;
env.allowLocalModels = true; 
env.localModelPath = "/models"
class PipelineSingleton {
  static task: PipelineType = "text-classification"
  static model = "PleIAs/Pleias-RAG-1B"

  static instance: any = null;

  static async getInstance(progress_callback: ProgressCallback) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, {progress_callback})
    }
    return this.instance;
  }

}

self.addEventListener("message", async (event) => {

})