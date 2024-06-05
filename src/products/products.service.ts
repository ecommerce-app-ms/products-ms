import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { paginationDto } from 'src/common/indes';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Products service');
  async onModuleInit() {
    await this.$connect();
    this.logger.log('dataBase connected');
  }

  create(createProductDto: CreateProductDto) {
    const produc = this.product.create({ data: createProductDto });
    return produc;
  }

  async findAll(paginationDto: paginationDto) {
    const { page, limit } = paginationDto;
    const totalPages = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPages / limit);
    const products = await this.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { available: true },
    });
    return {
      data: products,
      meta: {
        page: page,
        totalPages: totalPages,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id: id, available: true },
    });
    if (!product) {
      throw new NotFoundException(`Product whit id ${id} no found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;
    await this.findOne(id);
    const product = await this.product.update({
      where: { id },
      data: data,
    });

    return product;
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.product.delete({
      where: { id },
    });
  }
  async SofRemove(id: number) {
    await this.findOne(id);

    const product = await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });
    return product;
  }
}
