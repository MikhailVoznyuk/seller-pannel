import { useMemo, useState } from 'react';
import { Bot, SendHorizontal } from 'lucide-react';
import { requestChatAnswer } from '@/entities/ad/api/ad-api';
import { buildTextDiff } from '@/entities/ad/lib/diff-text';
import type { ChatMessage, EditDraft } from '@/entities/ad/model/types';
import { useAbortGroup } from '@/shared/lib/use-abort-group';
import { Button } from '@/shared/ui/button/Button';
import { StatusCard } from '@/shared/ui/status-card/StatusCard';
import styles from './AiAssistantPanel.module.css';

type Props = {
  item: EditDraft;
  originalDescription: string;
  aiEnabled?: boolean;
};

export function AiAssistantPanel({ item, originalDescription, aiEnabled = false }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Я смотрю на контекст объявления автоматически. Спроси про описание, цену, позиционирование или что ещё стоит дописать.',
    },
  ]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { createController } = useAbortGroup();

  const diff = useMemo(() => buildTextDiff(originalDescription, item.description), [originalDescription, item.description]);

  const submitQuestion = async () => {
    const normalized = question.trim();
    if (!normalized) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: normalized }];
    setMessages(nextMessages);
    setQuestion('');
    setIsLoading(true);
    setError('');

    const { controller, release } = createController();

    try {
      const response = await requestChatAnswer(
        {
          item,
          messages: nextMessages,
          question: normalized,
        },
        controller.signal,
      );

      setMessages((prev) => [...prev, { role: 'assistant', content: response.answer }]);
    } catch (requestError) {
      if ((requestError as Error).name !== 'AbortError') {
        setError((requestError as Error).message || 'Ошибка AI-чата');
      }
    } finally {
      release();
      setIsLoading(false);
    }
  };

  return (
    <aside className={styles.panel}>
      {aiEnabled ? (
        <div className={styles.section}>
          <div className={styles.heading}>
            <Bot size={18} />
            <h2 className={styles.title}>AI-чат</h2>
          </div>

          {error ? (
            <StatusCard title="Ошибка чата" tone="error">
              {error}
            </StatusCard>
          ) : null}

          <div className={styles.chat}>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`${styles.message} ${message.role === 'user' ? styles.user : styles.assistant}`}
              >
                {message.content}
              </div>
            ))}
          </div>

          <div className={styles.ask}>
            <textarea
              className={styles.textarea}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Например: какие детали добавить, чтобы объявление выглядело убедительнее?"
            />
            <Button variant="primary" onClick={submitQuestion} loading={isLoading}>
              <SendHorizontal size={16} />
              Отправить
            </Button>
          </div>
        </div>
      ) : null}

      <div className={styles.section}>
        <h2 className={styles.title}>{aiEnabled ? 'Было → стало' : 'Изменения'}</h2>

        <div className={styles.compare}>
          <div className={styles.compareBlock}>
            <h3 className={styles.compareTitle}>Исходное описание</h3>
            <p className={styles.compareText}>{originalDescription || 'Описание отсутствовало.'}</p>
          </div>

          <div className={styles.compareBlock}>
            <h3 className={styles.compareTitle}>Текущее описание</h3>
            <p className={styles.compareText}>
              {diff.length ? (
                diff.map((part, index) => (
                  <span
                    key={`${part.value}-${index}`}
                    className={`${part.added ? styles.added : ''} ${part.removed ? styles.removed : ''}`}
                  >
                    {part.value}
                  </span>
                ))
              ) : (
                'Изменений пока нет.'
              )}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
