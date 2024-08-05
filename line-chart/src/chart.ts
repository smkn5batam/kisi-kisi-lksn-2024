export interface ChartData {
  label: string; // X Axis
  value: number; // Y Axis
}
export interface ChartConfig {
  labelTitle: string;
  valueTitle: string;
  data: ChartData[];
}

interface ChartDataWithXY extends ChartData {
  x: number;
  y: number;
}

interface ValueLabelItem {
  value: number;
  y: number;
}

export class Chart {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  config: ChartConfig;
  width: number;
  height: number;
  data: ChartDataWithXY[];

  marginBottom = 30;
  marginLeft = 30;
  labelTitleWidth = 60;
  labelTitleLRMargin = 8;
  valueTitleHeight = 40;
  valueTitleTBMargin = 8;
  totalValueLabelPoint = 5;

  axisLabelColor = "#000000";
  dataLineColor = "#ff0000";

  constructor(element: HTMLCanvasElement, config: ChartConfig) {
    this.canvas = element;
    this.ctx = element.getContext("2d")!;
    this.config = config;
    this.width = element.width;
    this.height = element.height;

    // Calculate X, Y Position of data
    const startDataX = this.marginLeft + this.labelTitleLRMargin;
    const endDataX =
      this.width - this.labelTitleWidth - this.labelTitleLRMargin;
    const totalDataWidth = endDataX - startDataX; // Width of chart data (red line)
    const distanceBetweenDataX = Math.round(
      totalDataWidth / (this.config.data.length - 1)
    );

    const startDataY = this.valueTitleHeight + this.valueTitleTBMargin;
    const endDataY = this.height - this.marginBottom - this.valueTitleTBMargin;
    const totalDataHeight = endDataY - startDataY;

    const valuesArray = this.config.data.map((item) => item.value);
    const largestDataValue = Math.max(...valuesArray);
    const smallestDataValue = Math.min(...valuesArray);

    // Ratio of data value and chart area (scale down / up chart value)
    var scaleDataRatio =
      (totalDataHeight - 1) / (largestDataValue - smallestDataValue);

    const data: ChartDataWithXY[] = [];
    for (let idx = 0; idx < this.config.data.length; idx++) {
      const item = this.config.data[idx];
      const x = startDataX + distanceBetweenDataX * idx;
      const yFromBottom = Math.round(
        (item.value - smallestDataValue) * scaleDataRatio
      );
      const y = endDataY - yFromBottom;

      data.push({
        ...item,
        x,
        y,
      });
    }
    this.data = data;

    // Calculate Y Axis label
    const valueLabel: ValueLabelItem[] = [];
    const distanceBetweenLabelY = Math.round(
      totalDataHeight / (this.totalValueLabelPoint - 1)
    );

    const scaleDownLabelRatio =
      (largestDataValue - smallestDataValue) / (this.totalValueLabelPoint - 1);
    for (let idx = 0; idx < this.totalValueLabelPoint; idx++) {
      const yFromBottom = distanceBetweenLabelY * idx;
      const value = Math.round(idx * scaleDownLabelRatio) + smallestDataValue;
      const y = endDataY - yFromBottom;
      valueLabel.push({
        value,
        y,
      });
    }

    this.renderXlabel();
    this.renderYLabel(valueLabel);
    this.renderData();
  }

  renderXlabel() {
    this.ctx.beginPath();

    this.ctx.moveTo(this.marginLeft, this.height - this.marginBottom);
    this.ctx.lineTo(
      this.width - this.labelTitleWidth,
      this.height - this.marginBottom
    );
    this.ctx.strokeStyle = this.axisLabelColor;
    this.ctx.stroke();

    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    this.ctx.font = "12px Sans Serif";
    for (const item of this.data) {
      this.ctx.fillText(
        item.label,
        item.x,
        this.height - this.marginBottom + 10
      );
      this.ctx.beginPath();

      this.ctx.moveTo(item.x, this.height - this.marginBottom);
      this.ctx.lineTo(item.x, this.height - this.marginBottom + 5);
      this.ctx.stroke();
    }
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      this.config.labelTitle,
      this.width - this.labelTitleWidth + 4,
      this.height - this.marginBottom + 2
    );
  }

  renderYLabel(valueLabel: ValueLabelItem[]) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.marginLeft, this.valueTitleHeight);
    this.ctx.lineTo(this.marginLeft, this.height - this.marginBottom);
    this.ctx.stroke();
    this.ctx.textAlign = "right";
    this.ctx.textBaseline = "bottom";
    this.ctx.font = "12px Sans Serif";
    for (const item of valueLabel) {
      this.ctx.fillText(item.value.toString(), this.marginLeft - 8, item.y + 8);

      this.ctx.beginPath();

      this.ctx.moveTo(this.marginLeft - 5, item.y);
      this.ctx.lineTo(this.marginLeft, item.y);
      this.ctx.stroke();
    }
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "bottom";
    this.ctx.fillText(
      this.config.valueTitle,
      this.marginLeft,
      this.valueTitleHeight - 8
    );
  }

  renderData() {
    this.ctx.strokeStyle = this.dataLineColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    for (let idx = 0; idx < this.data.length; idx++) {
      const current = this.data[idx];
      const next = this.data[idx + 1];
      if (!next) break; // Last data

      this.ctx.moveTo(current.x, current.y);
      this.ctx.lineTo(next.x, next.y);
    }
    this.ctx.stroke();
  }
}
