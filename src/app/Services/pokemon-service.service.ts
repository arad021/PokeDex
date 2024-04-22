import { Injectable } from '@angular/core';
import {Pokemon} from "../pokemon-api-type";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PokemonServiceService {


  constructor(private  httpClient: HttpClient) { }


  public getPokemon$(name: string): Observable<Pokemon>{

    return  this.httpClient.get<Pokemon>('https://pokeapi.co/api/v2/pokemon/' + name)
  }
}
