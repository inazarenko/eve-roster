import { jsonEndpoint } from "../../../../infra/express/protectedEndpoint";
import { getRunnableTasks } from "../../../../task-registry/runnableTasks";

export type Output = {
  name: string;
  displayName: string;
  description: string;
}[];

export default jsonEndpoint(
  (req, res, db, account, privs): Promise<Output> => {
    privs.requireRead("serverConfig");

    const tasks = getRunnableTasks().map((task) => ({
      name: task.name,
      displayName: task.displayName,
      description: task.description,
    }));

    return Promise.resolve(tasks);
  }
);
