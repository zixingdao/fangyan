# AI 编程协作指南 (AI Coding Guidelines)

> 本文档旨在构建一个对大语言模型 (LLM) 友好的代码环境。遵循这些规则可以显著提高 AI 生成代码的准确性、可读性和可维护性。

## 1. 核心原则：AI 友好型架构 (AI-Friendly Architecture)

### 1.1 Schema 驱动开发 (Schema-Driven Development)
*   **规则**: 在编写任何逻辑代码之前，**必须**先在 `packages/shared` 中定义 Zod Schema 和 Types。
*   **理由**: Schema 是前后端的“契约”，Zod 提供了运行时的验证能力，Types 提供了编译时的安全。
*   **实践**: 
    - **Shared**: 定义 `CreateUserSchema` (Zod) -> 导出 `CreateUserDto` (Type)。
    - **Backend**: Controller 使用 `ZodValidationPipe` 验证请求体。
    - **Frontend**: Form 使用 `zodResolver` 配合 React Hook Form 进行表单验证。

### 1.2 上下文聚合 (Context Locality)
*   **规则**: 严格遵守 Monorepo 和 Feature-Based 目录结构。
*   **理由**: 相关的代码应该物理上在一起。
*   **实践**:
    - **Features**: 一个功能的所有前端代码（API, Hooks, UI, State）都应放在 `apps/client/src/features/xxx` 下。
    - **Shared**: 通用的类型和逻辑放在 `packages/shared`，通用的组件放在 `packages/ui`。
    - **禁止越界**: Feature A 不应直接引用 Feature B 的内部组件，应通过 Shared 或全局状态通信。

### 1.3 显式思维链 (Explicit Chain of Thought)
*   **规则**: 复杂逻辑必须先写注释步骤，再写代码。
*   **理由**: 强迫 AI 进行“慢思考”，减少逻辑跳跃错误。
*   **示例**:
    ```typescript
    // Step 1: 验证上传文件的格式和大小
    // Step 2: 计算文件的 MD5 哈希值用于秒传检测
    // Step 3: 获取 OSS 上传签名
    // Step 4: 执行上传并更新数据库状态
    ```

## 2. 编码规范：增强可解释性 (Interpretability)

### 2.1 语义化命名 (Semantic Naming)
*   **规则**: 变量名和函数名必须是**自解释**的，宁长勿短。
*   **理由**: 好的命名是最好的注释，能帮助 AI 快速建立语义索引。
*   **Bad**: `processData(d)`
*   **Good**: `processUserRecordingUpload(recordingFile)`

### 2.2 防御性编程 (Defensive Programming)
*   **规则**: 假设一切输入都是不可信的，一切外部调用都可能失败。
*   **理由**: AI 容易忽略边界情况（如网络超时、空值）。显式的防御逻辑能提高代码鲁棒性。
*   **实践**:
    - 所有 API 调用必须包裹在 `try-catch` 中。
    - 必须处理 `loading` 和 `error` 状态。
    - 必须对 `null/undefined` 进行非空断言或守卫检查。

### 2.3 确定性验证 (Deterministic Verification)
*   **规则**: 生成代码的同时，思考如何验证它。
*   **理由**: 对抗 AI 的“概率性输出”。
*   **实践**: 生成功能代码后，简述如何通过 `curl`、单元测试或控制台输出来验证功能是否正常。

## 3. 交互协议 (Interaction Protocol)

*   **语言**: 强制使用 **中文** 进行思考和回复（代码中的字符串除外）。
*   **完整性**: 
    - **严禁**使用 `// ...rest of code` 省略代码。
    - **严禁**引用不存在的第三方库（必须先检查 `package.json`）。
*   **错误修正**: 
    - 如果代码运行报错，不要盲目试错。先分析错误日志，解释原因，再给出修复方案。

---
**记住：清晰的结构 + 显式的类型 = 高智商的 AI。**
