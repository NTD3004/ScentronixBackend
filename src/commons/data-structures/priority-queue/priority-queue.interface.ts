export interface PriorityQueueInterface<T1, T2> {
  /**
   * @param {T1} val
   * @param {T2} priority
   */
  enqueue(val: T1, priority: T2): void;
  /**
   * @returns {NodeQueueInterface} The very first node in this queue
   */
  dequeue(): NodeQueueInterface<T1, T2>;
  bubbleUp(): void;
  sinkDown(): void;
  /**
   * @returns {number} Size of this queue
   */
  size(): number;
}

export interface NodeQueueInterface<T1, T2> {
  val: T1;
  priority: T2;
}

