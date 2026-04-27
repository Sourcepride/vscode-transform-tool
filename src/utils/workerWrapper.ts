// const resolves: Record<any, any> = {};
// const rejects: Record<any, any> = {};
// let globalMsgId = 0;

// // const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// //TODO:  understand and use right type (get rid of aany)
// // Activate calculation in the worker, returning a promise
// function sendMsg(payload: any, worker: Worker) {
//   const msgId = globalMsgId++;
//   const msg = {
//     id: msgId,
//     payload,
//   };
//   return new Promise(function (resolve, reject) {
//     // save callbacks for later
//     resolves[msgId] = resolve as any;
//     rejects[msgId] = reject as any;
//     worker.postMessage(msg);

//     // TODO: CHECK FOR MEMORY LEAK
//   });
// }
// // Handle incoming calculation result
// function handleMsg(msg: any) {
//   const { id, err, payload } = msg.data;

//   if (payload) {
//     const resolve = resolves[id];
//     if (resolve) {
//       resolve(payload);
//     }
//   } else {
//     // error condition
//     const reject = rejects[id];
//     if (reject) {
//       if (err) {
//         reject(new Error(err));
//       } else {
//         reject("Got nothing");
//       }
//     }
//   }

//   // purge used callbacks
//   delete resolves[id];
//   delete rejects[id];
// }

// export class Wrapper {
//   worker: Worker;

//   constructor(worker: Worker) {
//     this.worker = worker;
//     this.worker.onmessage = handleMsg;
//   }

//   send(str: string): Promise<any> {
//     return sendMsg(str, this.worker);
//   }
// }

// TODO:  figure out a way to fix
// NOTE: do not remove first arg:  why? vscode works differently from browsers and direct url to file cannot be used here thats why the Worker parameter is not use it exists so vite can bundle it
export async function getWorker(_Worker: any, workerName: string) {
  const windowObj = window as any;
  const res = await fetch(windowObj?.[workerName] || "");
  const blob = await res.blob();
  return new window.Worker(URL.createObjectURL(blob));
}
