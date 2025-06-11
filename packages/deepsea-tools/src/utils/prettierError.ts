export interface PrettierErrorParams {
    error: Error
    source: string
    time: string
}

/** 根据传入的 error 生成 HTML 代码用于邮件发送 */
export function prettierError({ error, source, time }: PrettierErrorParams): string {
    const message = error.message || "未知错误"
    const name = error.name || "Error"
    const stack = error.stack?.trim().replace(/^[\s\n]*(.*?)[\s\n]*$/s, "$1") || "暂无调用栈信息"

    return `<div style="background: white; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 800px; border-radius: 12px;">

      <!-- 错误来源 -->
      <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
              <span style="width: 6px; height: 6px; background: #10b981; border-radius: 50%; margin-right: 8px;"></span>
              错误来源
          </h3>
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 15px; color: #065f46; font-size: 14px; line-height: 1.5; font-weight: bold;">
              ${source}
          </div>
      </div>

      <!-- 错误时间 -->
      <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
              <span style="width: 6px; height: 6px; background: #3b82f6; border-radius: 50%; margin-right: 8px;"></span>
              错误时间
          </h3>
          <div style="background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px; padding: 15px; color: #1e40af; font-size: 14px; line-height: 1.5;">
              ${time}
          </div>
      </div>

      <!-- 错误类型 -->
      <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
              <span style="width: 6px; height: 6px; background: #f97316; border-radius: 50%; margin-right: 8px;"></span>
              错误类型
          </h3>
          <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 15px; color: #c2410c; font-size: 14px; line-height: 1.5; word-break: break-word;">
              ${name}
          </div>
      </div>

      <!-- 错误消息 -->
      <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
              <span style="width: 6px; height: 6px; background: #ef4444; border-radius: 50%; margin-right: 8px;"></span>
              错误消息
          </h3>
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; color: #dc2626; font-size: 14px; line-height: 1.5; word-break: break-word;">
              ${message}
          </div>
      </div>

      <!-- 调用栈 -->
      <div>
          <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
              <span style="width: 6px; height: 6px; background: #8b5cf6; border-radius: 50%; margin-right: 8px;"></span>
              调用栈
          </h3>
          <div style="background: #faf5ff; border: 1px solid #d8b4fe; border-radius: 8px; padding: 15px; color: #6b21a8; font-size: 13px; line-height: 1.6; white-space: pre-wrap; overflow-x: auto; max-height: 300px; overflow-y: auto;">${stack}</div>
      </div>

  </div>`
}
