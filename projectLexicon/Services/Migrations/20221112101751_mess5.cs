using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLexicon.Services.Migrations
{
    public partial class mess5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 1,
                column: "Created",
                value: new DateTime(2022, 11, 12, 11, 17, 51, 284, DateTimeKind.Local).AddTicks(2840));

            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 2,
                column: "Created",
                value: new DateTime(2022, 11, 12, 11, 17, 51, 284, DateTimeKind.Local).AddTicks(2870));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 1,
                column: "Created",
                value: new DateTime(2022, 11, 12, 11, 6, 8, 104, DateTimeKind.Local).AddTicks(3790));

            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 2,
                column: "Created",
                value: new DateTime(2022, 11, 12, 11, 6, 8, 104, DateTimeKind.Local).AddTicks(3810));
        }
    }
}
