import { Inject, Injectable } from '@nestjs/common';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { SavedSearchArgs } from '../dto/savedSearchArgs';
import { ActionResponseUnion } from '../models/baseResponse';
import { SavedSearchResponseUnion, SavedSearchUnion } from '../models/savedSearch';

@Injectable()
export class SavedSearchService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }
  async getSavedSearches(savedSearchArgs: SavedSearchArgs): Promise<typeof SavedSearchResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getSavedSearches,
      savedSearchArgs
    );
  }

  createSavedSearch(savedSearchArgs: SavedSearchArgs): Promise<typeof SavedSearchUnion> {
    const { userId, public: publicSearch, name, ...config } = savedSearchArgs;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createSavedSearch, {
      savedSearch: { name, userId, public: publicSearch ?? false, config },
    });
  }

  deleteSavedSearch(savedSearchArgs: SavedSearchArgs): Promise<typeof ActionResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.deleteSavedSearch,
      savedSearchArgs
    );
  }

  updateSavedSearch(savedSearchArgs: SavedSearchArgs): Promise<typeof SavedSearchUnion> {
    const { id, userId, public: publicSearch, name, ...config } = savedSearchArgs;
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateSavedSearch, {
      savedSearch: { id, name, userId, ...(typeof publicSearch === 'boolean' && { public: publicSearch }), config },
    });
  }
}
