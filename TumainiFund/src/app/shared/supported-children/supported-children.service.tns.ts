import { Injectable, OnInit } from "@angular/core";
import { Child } from "./child.model";

@Injectable()
export class SupportedChildrenService{
    public defaultSupportedChildren: Array<Child>;
    constructor(
    ){
        this.defaultSupportedChildren = [
            {
                id: 0,
                first_name: "test 1",
                last_name: "test 1",
                age: 1,
                date_of_birth: {
                    day:22,
                    month:0o7,
                    year:2001,
                },
                gender: "Male",
                school: {
                    school: "school",
                    level: "education high",
                    books: "No",
                },
                head_of_family: {
                    hof:"person",
                    relation:"nephew",
                },
                personal_status: "Single",
                future_educational_goals:"orem ipsum dolor sit amet,\nconsectetur adipiscing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\nUt enim ad minim veniam, quis Nostrud",
                hygiene_kits: "Yes",
                medical_support: "Yes",
                transport_to_clinic: "Yes",
            },
            {
                id: 1,
                first_name: "test 2",
                last_name: "test 2",
                age: 2,
                date_of_birth: {
                    day:22,
                    month:0o7,
                    year:2001,
                },
                gender: "Male",
                school: {
                    school: "school",
                    level: "education high",
                    books: "No",
                },
                head_of_family: {
                    hof:"person",
                    relation:"nephew",
                },
                personal_status: "Single",
                future_educational_goals:"orem ipsum dolor sit amet,\nconsectetur adipiscing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\nUt enim ad minim veniam, quis Nostrud",
                hygiene_kits: "Yes",
                medical_support: "Yes",
                transport_to_clinic: "Yes",
            },
            {
                id: 2,
                first_name: "test 3",
                last_name: "test 3",
                age: 3,
                date_of_birth: {
                    day:22,
                    month:0o7,
                    year:2001,
                },
                gender: "Male",
                school: {
                    school: "school",
                    level: "education high",
                    books: "No",
                },
                head_of_family: {
                    hof:"person",
                    relation:"nephew",
                },
                personal_status: "Single",
                future_educational_goals:"orem ipsum dolor sit amet,\nconsectetur adipiscing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\nUt enim ad minim veniam, quis Nostrud",
                hygiene_kits: "Yes",
                medical_support: "Yes",
                transport_to_clinic: "Yes",
            },
            {
                id: 3,
                first_name: "test 4",
                last_name: "test 4",
                age: 4,
                date_of_birth: {
                    day:22,
                    month:0o7,
                    year:2001,
                },
                gender: "Male",
                school: {
                    school: "school",
                    level: "education high",
                    books: "No",
                },
                head_of_family: {
                    hof:"person",
                    relation:"nephew",
                },
                personal_status: "Single",
                future_educational_goals:"orem ipsum dolor sit amet,\nconsectetur adipiscing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\nUt enim ad minim veniam, quis Nostrud",
                hygiene_kits: "Yes",
                medical_support: "Yes",
                transport_to_clinic: "Yes",
            },
            {
                id: 4,
                first_name: "test 5",
                last_name: "test 5",
                age: 5,
                date_of_birth: {
                    day:22,
                    month:0o7,
                    year:2001,
                },
                gender: "Male",
                school: {
                    school: "school",
                    level: "education high",
                    books: "No",
                },
                head_of_family: {
                    hof:"person",
                    relation:"nephew",
                },
                personal_status: "Single",
                future_educational_goals:"orem ipsum dolor sit amet,\nconsectetur adipiscing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\nUt enim ad minim veniam, quis Nostrud",
                hygiene_kits: "Yes",
                medical_support: "Yes",
                transport_to_clinic: "Yes",
            },
        ]
    }
}